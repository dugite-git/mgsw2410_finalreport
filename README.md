### Discordを使った湿度・温度遠隔確認プログラム
discordのボットのコマンドを通じ、arduinoのある地点の湿度と温度を確認できる。

|コマンド一覧||
|-|-|
|/getalldata|湿度と温度を返す|
|/gethumidity|湿度を返す|
|/gettemperature|温度を返す|

discordのボットを使わなくとも直接```mosquitto_pub -l -t test/client -h localhost```を使って操作することも出来る。

|コマンド一覧||
|-|-|
|-1|arduinoのシリアル通信を閉じる|
|0|湿度を返す|
|1|温度を返す|

> [!NOTE]
> ```mosquitto_pub -l -t test/client -h localhost```の```-h```以降は.envで指定したブローカーのアドレスを入力してください

```-1```で閉じたシリアル通信はarduinoのボタンを長押しで再開できます。

### 環境
OS: Ubuntu 22.04.4 LTS (WSL2)

機材: Grove Beginner Kit for Arduino (DHT20搭載)

### 前提条件
- ディスコードのbotを作成している。
- /discordディレクトリにsample.envを参考に.envファイルを作成し、環境変数を入力している。
- arduinoに/arduinoディレクトリのソースコードをコンパイルしてアップロードしている。
- node.jsが入っている

### QuickStart
1. /shellディレクトリで以下のコマンドをする。
```
./report_server_pub.sh
```
2. 新しくターミナルを立ち上げ、1と同様に以下のコマンドをする。
```
./report_server_sub.sh
```
3. 新しくターミナルを立ち上げ、/discordディレクトリで以下のコマンドをする。
```
npm start
```

### 補足
- /arduinoはVScodeのplatformIOのプロジェクトファイルになっているので、platformIOのプロジェクトファイルとして認識させれば簡単にコードの適用が出来るはずです。
- /shellにあるファイルの/dev/ttyUSB0の部分は環境によって異なる可能性があるので、適宜```ls -l /dev/ttyACM* /dev/ttyUSB*```などのコマンドを利用して確認し、変更してください。
- wsl2でusbを認識させた際、```sudo chmod 666 /dev/ttyUSB0```などで権限を渡さないと、シェルスクリプトが動作しないので注意してください。
- /arduino/src/main.cの26行目のdevice_idを変更するとデバイスIDが変わります。
