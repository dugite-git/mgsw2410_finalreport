# シリアルポートの設定
stty -F /dev/ttyUSB0 57600

# MQTTブローカーからデータを受信し、シリアルポートに送信
mosquitto_sub -t test/client -h localhost | while read -r line; do
  echo "$line" > /dev/ttyUSB0
done
