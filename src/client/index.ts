import _ from "lodash";
import { DataCore } from "../core";
import { ClientUpdateMeta } from "../interfaces";

export class ClientData<T> {
    private readonly client: SocketIOClient.Socket;
    private readonly core: DataCore<T>;
    private changeMeta: ClientUpdateMeta;

    public get data() {
        return this.core.data;
    }

    public static async connect<T>(client: SocketIOClient.Socket) {
        let data: T;

        if (client.connected) {
            data = await requestData();
        }
        else {
            await getConnection();
            data = await requestData();
        }

        return new ClientData(client, data);

        function getConnection() {
            return new Promise((resolve) => {
                client.once("connect", resolve);
            });
        }

        function requestData(): Promise<T> {
            return new Promise((resolve) => {
                client.emit("request-data", (data: T) => {
                    resolve(data);
                });
            });
        }
    }

    private constructor(client: SocketIOClient.Socket, data: T) {
        this.client = client;

        this.core = new DataCore<T>({
            valueWillChange: (change, path) => {
                // this.client.emit("update", { [path]: change.newValue });

                return change;
            },
        }, data);
    }

    private emitUpdate(update: {}) {
        const isValid = (valid: boolean) => {

        };

        this.client.emit("update", update, isValid);
    }

    private receiveUpdate(update: {}) {
        this.changeMeta = { origin: "server" };

        _.forEach(update, (value, path) => {
            _.set(this.data as {}, path, value);
        });

        this.changeMeta = { origin: "client" };
    }
}