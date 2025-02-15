#include <Arduino.h>
#include <Grove_Temperature_And_Humidity_Sensor.h>
#include <TaskScheduler.h>

// 接続するセンサの型番を定義する(DHT11 or DHT20)
// #define DHTTYPE DHT11       // 初代GBKAの場合（水色カバー）
#define DHTTYPE DHT20 // 新型GBKAの場合（黒色カバー）

#if (DHTTYPE == DHT20)
DHT dht(DHTTYPE); // センサーの初期化
#else
#define DHTPIN 3 // 3 は GBKA の場合
DHT dht(DHTPIN, DHTTYPE); // センサーの初期化
#endif

const int buttonPin = 6; // ボタンのピン番号
int buttonState = 0;     // ボタンの状態

Scheduler runner; // タスクスケジューラの初期化

// 計測値設定
float hum_temp_val[2] = {0.0f};
float Temperature = 0.0f; // 温度
float Humidity = 0.0f;    // 湿度

String device_id = "one-001"; // デバイスID

void readSensor();
void handleSerial();
void buttonCheck();
Task t1(2000, TASK_FOREVER, &readSensor, &runner, true);
Task t2(100, TASK_FOREVER, &handleSerial, &runner, true);
Task t3(100, TASK_FOREVER, &buttonCheck, &runner, true);

void setup()
{
  pinMode(buttonPin, INPUT); // ボタンのピンを入力に設定

  Serial.begin(57600); // シリアル通信の開始
  Wire.begin();
  dht.begin(); // センサーの動作開始
}

void loop()
{
  runner.execute(); // タスクスケジューラの実行
}

void readSensor()
{
  delay(2000); // センサーの読み取りを2秒間隔に
  if (!dht.readTempAndHumidity(hum_temp_val))
  {
    Humidity = hum_temp_val[0];
    Temperature = hum_temp_val[1];
  }
  else
  {
    Humidity = 100.0f;
    Temperature = 100.0f;
  }
  Serial.print(device_id + "\t"); // ← この部分は各自で変更せよ

  Serial.print(millis());
  Serial.print("\t");
  Serial.print(0);
  Serial.print("\t");
  Serial.print(Humidity);
  Serial.print("\t");
  Serial.print(Temperature);
  Serial.print("\n");
}

void handleSerial()
{
  if (Serial.available() > 0)
  {
    char c;
    int v1;
    c = Serial.read();
    v1 = c - '0';
    if (v1 == 2)
    {
      Serial.print(device_id + "\t");

      Serial.print(millis());
      Serial.print("\t");
      Serial.print(-1);
      Serial.print("\t");
      Serial.print("Closed\n");
      Serial.flush();
      Serial.end();
    }
    else if (v1 == 0)
    {
      Serial.print(device_id + "\t");

      Serial.print(millis());
      Serial.print("\t");
      Serial.print(1);
      Serial.print("\t");
      Serial.print(Humidity);
      Serial.print("\t");
      Serial.print(100);
      Serial.print("\n");
    }
    else if (v1 == 1)
    {
      Serial.print(device_id + "\t");

      Serial.print(millis());
      Serial.print("\t");
      Serial.print(1);
      Serial.print("\t");
      Serial.print(100);
      Serial.print("\t");
      Serial.print(Temperature);
      Serial.print("\n");
    }
  }
}

void buttonCheck()
{
  buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH)
  {
    Serial.begin(57600);

    Serial.print(device_id + "\t");

    Serial.print(millis());
    Serial.print("\t");
    Serial.print(-1);
    Serial.print("\t");
    Serial.print("Opened\n");
    Serial.flush();
  }
}
