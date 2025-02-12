# シリアルポートの設定
stty -F /dev/ttyUSB0 57600

# シリアルポートからデータを読み取り、MQTTブローカーに送信
(cat -s | sudo cu -s 57600 -l /dev/ttyUSB0) | nkf -u -Lu | mosquitto_pub -l -t test/server -h localhost