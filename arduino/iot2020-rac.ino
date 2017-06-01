#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal.h>

const int RST_PIN = 9; // Pin 9 para el reset del RC522
const int SS_PIN  = 10; // Pin 10 para el SS (SDA) del RC522
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Crear instancia del MFRC522
bool init_ = true;
int red_   =A3;
int green_ =A2;
int blue_  =A1;
LiquidCrystal lcd(7, 8, 5, 4, 3, 2);


void setup(){
 Serial.begin(9600);
 SPI.begin();

 mfrc522.PCD_Init();

 lcd.begin(16,2);
 lcd.print("SIT Iot2020 access");
}

void loop(){
 if (mfrc522.PICC_IsNewCardPresent()){
	 if (mfrc522.PICC_ReadCardSerial()){
		   printArray(mfrc522.uid.uidByte, mfrc522.uid.size);
	     analogWrite(A4, 180);
		   mfrc522.PICC_HaltA();
       analogWrite(A4, 0);
	  }
  }
  serial_read();
  delay(250);
}

void printArray(byte *buffer, byte bufferSize) {
  lcd.clear();
  for (byte i = 0; i < bufferSize; i++) {
      Serial.print(buffer[i], HEX);
      lcd.print(buffer[i],HEX);
    }
}

void serial_read(){
	 String read=Serial.readString();
	 lcd.clear();
	 if(read.substring(0,2)=="nk"){
		    colors_led(2);
	 }
   else if(read.substring(0,2)=="ok"){
		   colors_led(1);
	 }
   else if(read.substring(0,2)=="nn"){
		   colors_led(3);
	 }
   clean_led();
	 lcd.setCursor(0,1);
   lcd.print(read);
}

void clean_led(){
	 analogWrite(red_, 0);
	 analogWrite(green_, 0);
	 analogWrite(blue_, 0);
}

void colors_led(int status){
	switch (status) {
	  case 1:
	    analogWrite(red_, 0);
			analogWrite(green_, 250);
			analogWrite(blue_, 0);
			analogWrite(A4, 180);
			delay(50);
	    analogWrite(A4, 0);
      break;
	  case 2:
	    analogWrite(red_, 250);
			analogWrite(green_, 0);
			analogWrite(blue_, 0);
			analogWrite(A4, 180);
			delay(50);
			analogWrite(A4, 0);
			delay(50);
			analogWrite(A4, 180);
			delay(50);
			analogWrite(A4, 0);
      break;
	  case 3:
	    analogWrite(red_, 250);
			analogWrite(green_, 230);
			analogWrite(blue_, 70);
			analogWrite(A4, 180);
			delay(50);
			analogWrite(A4, 0);
			delay(50);
			analogWrite(A4, 180);
			delay(50);
			analogWrite(A4, 0);
			analogWrite(A4, 180);
			delay(50);
			analogWrite(A4, 0);
      break;
	}
}
