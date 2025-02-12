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
        .setName('gethumidity')
        .setDescription('接続しているarduinoがある場所の湿度を受信します。'),
    async execute(interaction) {
        // インタラクションを受け取った直後に一時的な応答を送信
        await interaction.deferReply();

        // MQTTで0を送信
        mqttClient.publish('test/client', '0');

        // データが返ってくるまで待機
        let humidityData;
        while (!humidityData) {
            const dataParts = latestData.split(/\s+/);
            if (dataParts.length >= 5 && dataParts[2] === '1') {
                const deviceNumber = dataParts[0];
                const humidity = dataParts[3];
                humidityData = `${deviceNumber}\n湿度: ${humidity}%`;
            }
            // 短い遅延を入れてループを回し続ける
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 湿度データを最終的な応答として返信
        await interaction.editReply(humidityData);
    },
};
