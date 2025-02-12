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
        .setName('gettemperature')
        .setDescription('接続しているarduinoがある場所の温度を受信します。'),
    async execute(interaction) {
        // インタラクションを受け取った直後に一時的な応答を送信
        await interaction.deferReply();

        // MQTTで1を送信
        mqttClient.publish('test/client', '1');

        // データが返ってくるまで待機
        let temperatureData;
        while (!temperatureData) {
            const dataParts = latestData.split(/\s+/);
            if (dataParts.length >= 5 && dataParts[2] === '1') {
                const deviceNumber = dataParts[0];
                const temperature = dataParts[4];
                temperatureData = `${deviceNumber}\n温度: ${temperature}℃`;
            }
            // 短い遅延を入れてループを回し続ける
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 温度データを最終的な応答として返信
        await interaction.editReply(temperatureData);
    },
};
