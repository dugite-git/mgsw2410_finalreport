const { SlashCommandBuilder } = require('@discordjs/builders');
const mqtt = require('mqtt');
require('dotenv').config();

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost');
let latestData = 'No data received yet';

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('test/server', (err) => {
    if (!err) {
      console.log('Subscribed to test/server');
    }
  });
});

mqttClient.on('message', (topic, message) => {
  latestData = message.toString();
  console.log(`Received message: ${latestData} on topic: ${topic}`);
});

console.log('Started MQTT client');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getalldata')
    .setDescription('接続しているarduinoがある場所の湿度と温度を受信します。'),
  async execute(interaction) {
    // データを解析して文章を作成
    const dataParts = latestData.split(/\s+/);
    if (dataParts.length >= 5) {
      const deviceNumber = dataParts[0];
      const humidity = dataParts[3];
      const temperature = dataParts[4];
      const responseMessage = `現在${deviceNumber}の地点の湿度は${humidity}%、温度は${temperature}℃です。`;
      await interaction.reply(responseMessage);
    } else {
      await interaction.reply('データの形式が正しくありません。');
    }
  },
};
