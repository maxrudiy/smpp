import net from "net";

class ControllerService {
  async openDoor(controllerIp, controllerPort, controllerId, door) {
    try {
      const request = Buffer.alloc(64);
      request.writeUInt8(0x17, 0);
      request.writeUInt8(0x40, 1);
      request.writeUInt32LE(controllerId, 4);
      request.writeUInt8(door, 8);

      const result = await new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(controllerPort, controllerIp, () => {
          client.write(request);
        });
        client.on("data", (data) => {
          client.destroy();
          resolve(data);
        });
        client.on("error", (err) => reject(err));
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

export default new ControllerService();
