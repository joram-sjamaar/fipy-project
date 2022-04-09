from network import LTE
import time
from mqtt import MQTTClient, MQTTException

iot_hub_name = "iotc-c456aa00-d6da-4b61-91c4-fe5dbda847e2"
sas_token = "1/oZoFV02MHFOIaI2iH9IuOAOQQkLisTmBYQiOE9qXo="
device_id = "1mp8wo6ck0z"
ca_path = "/flash/cert/BaltimoreCyberTrustRoot.crt.pem"

lte = LTE() # LTE name is deceiving. It's actually NB-IoT. Firmware has been upgraded accordingly.
lte.attach()

while not lte.isattached():
    time.sleep(0.5)
    print("%", end="")
print("\nAttached to network!")

lte.connect() # start a data session and obtain an IP address

while not lte.isconnected():
    time.sleep(0.5)
    print("-", end="")
print("Connected to network!")


def sub_callback(topic, msg):
  print(msg)

try:
    print("Connecting to MQTT...")
    client = MQTTClient(
        client_id=device_id,
        server="40.113.176.171", # No dns resolve.....
        user="iotc-c456aa00-d6da-4b61-91c4-fe5dbda847e2.azure-devices.net/1mp8wo6ck0z/?api-version=2021-04-12",
        password="SharedAccessSignature sr=iotc-c456aa00-d6da-4b61-91c4-fe5dbda847e2.azure-devices.net%2Fdevices%2F1mp8wo6ck0z&sig=sH%2BVB7DmFHMX8bjmZ3HRI2CyKjpDB9QbAnPU9aZtTWc%3D&se=1649452259",
        port=8883, 
        keepalive=100,
        ssl=True,
        ssl_params={
            'ca_certs': ca_path # Baltimore Cyber Trust Root. Used by Azure.
        }
    )
    client.set_callback(sub_callback)
    client.connect()
    print("Connected to MQTT!")

    while True:
        jsonString = input()

        if jsonString:
            print("Sending: " + jsonString)
            client.publish(topic="devices/"+device_id+"/messages/events/", msg=jsonString, qos=0)

except MQTTException as e:
      print('Caugh exception:', e)