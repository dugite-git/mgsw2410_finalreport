# シリアルポートの設定
stty -F /dev/ttyUSB0 57600

# シリアルポートからデータを読み取り、MQTTブローカーに送信
mosquitto_sub -t test/client -h localhost | nkf -u -Lu | (cat -s | sudo cu -s 57600 -l /dev/ttyUSB0) | nkf -u -Lu | mosquitto_pub -l -t test/server -h localhost
