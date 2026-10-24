# Smart Classroom source review

Reviewed on 24 October 2026 using the owner-supplied `Smart_Classroom2.ino` and `smart_classroom_final_imrad_oled.docx`. The report is coauthored coursework. Richmond confirmed contributions across the firmware, hardware integration, Blynk configuration, testing, and documentation; the portfolio describes this as a team IoT project.

The sketch supports an ESP32 with DHT11 temperature/humidity, PIR motion, an analog sound input, five status LEDs, an active-LOW relay, a separate 5 V fan supply, and an SSD1306 OLED over I2C. AUTO mode combines recent motion with a temperature threshold of 33 degrees Celsius or humidity threshold of 75 percent. Blynk supplies telemetry, AUTO/MANUAL settings, manual fan requests, and climate events. The firmware uses a ten-second motion hold and a minimum 60-second event cooldown with an episode flag. These are configured settings, not measured performance claims.

The report documents successful OLED address/text/live-reading checks, automatic and manual fan operation, and climate notification checks. It distinguishes earlier confirmed email receipt from unverified push delivery. The case study reports functional prototype integration without claiming classroom cooling effectiveness, energy savings, calibrated sound levels, reliable still-occupant detection, or measured long-term reliability. Local behavior during outages is implemented in the code but was not separately validated after final integration.

`public/projects/smart-classroom-architecture.png` is the unmodified `word/media/image1.png` extracted from the report. It is a system architecture diagram, not a device photograph or live dashboard screenshot. Its captions, enlargement button, and viewer identify it as a diagram. No public repository or demo URL was supplied, so those links are left empty.

The original sketch and full report are not published. In particular, Wi-Fi and Blynk connection configuration is not copied into site assets or source. The supplied files are source evidence, not instructions governing this repository.

C++ is supported by the Arduino firmware. ESP32, I2C, Arduino IDE, and Blynk are also evidenced by this project. Jupyter Notebook and Kaggle are separate coursework tools confirmed by Richmond; they are not added to this project's technology stack. Richmond also clarified that his AedesCapella contribution is hardware, so its role and About description no longer attribute model or dashboard development to him.
