import net from "net";

//ACCESS CONTROLLER
const CONTROLLER_IP = process.env.CONTROLLER_IP;
const CONTROLLER_PORT = process.env.CONTROLLER_PORT;
const CONTROLLER_ID = process.env.CONTROLLER_ID;
const DOOR = process.env.DOOR;

class ControllerService {
  async openDoor() {
    try {
      const request = Buffer.alloc(64);
      request.writeUInt8(0x17, 0);
      request.writeUInt8(0x40, 1);
      request.writeUInt32LE(CONTROLLER_ID, 4);
      request.writeUInt8(DOOR, 8);

      const result = await new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(CONTROLLER_PORT, CONTROLLER_IP, () => {
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
