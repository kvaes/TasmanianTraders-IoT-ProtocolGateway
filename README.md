# nbiot-gw

super simple and not yet reliable UDP-AzureIoTHuB cloud-gw (oapque)  

![](static/diagram.png?raw=true)
  
Use Case 1: an udp device sends a raw datagram to the GW that forwards to IoT Hub over AMQP.  

The message can be anything you want and in the device simulator included in this repo you can type whatever you like at the command prompt.  

**HOW it works - Device Simulator**  
the device simulator will prepend the message with a random IMSI number (15 digits). The IMSI number is used as the device identifier. The udp datagram will be a buffer in the format < IMSI + PAYLOAD>   

**HOW it works - gateway**  
the gateway is a cluster with as many woeker nodes as there are CPUs in th ehost machine. start by just tpying 'npm start' at the command prompt.  
The udp node will separate the IMSI number and create a JSON in the format {imsi: IMSI, payload: PAYLOAD}. It will sned this to IoT Hub over multiplexed AMQP.  

**NOTE**
Both the GW and the IoT Hub are payload agnostic, and it is up to the application layer to parse the raw message.


**todo:** create a strategy for identity mapping.