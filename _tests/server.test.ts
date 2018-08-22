import _ from "lodash";
import ServerIO from "socket.io";
import ClientIO from "socket.io-client";
import getPort from "get-port";
import { ServerData } from "../src/server";
import sleep from "then-sleep";
import { ClientData } from "../src/client";

it("Server Works", async () => {
    const baseData = {
        foo: "bar"
    };

    const port         = await getPort(),
          socketServer = ServerIO(port),
          uri          = `http://localhost:${port}/`;

    const serverData = new ServerData(socketServer, baseData),
          data     = serverData.data;

    const clientData = await ClientData.connect<typeof baseData>(ClientIO(uri));
    clientData.data.foo = "foobar!";

    await sleep(30);
});