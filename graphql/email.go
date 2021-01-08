package main

import (
	"encoding/json"
	"fmt"
	"os"

	"gopkg.in/gomail.v2"
)

func sendEmail(dish Dish, restSlug string) (interface{}, error) {
	emailUsername := os.Getenv("VEGANOMICS_EMAIL_ADDRESS")
	emailPassword := os.Getenv("VEGANOMICS_EMAIL_PW")
	dishJSON, err := json.MarshalIndent(dish, "", "	")
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	m := gomail.NewMessage()

	m.SetHeader("From", emailUsername)
	m.SetHeader("To", emailUsername)
	m.SetHeader("Subject", "New dish suggestion for "+restSlug)
	m.SetBody("text/html", "<pre>"+string(dishJSON)+"</pre>")

	d := gomail.NewDialer("smtp.gmail.com", 587, emailUsername, emailPassword)

	if err2 := d.DialAndSend(m); err2 != nil {
		fmt.Println(err2)
		return nil, err2
	}
	fmt.Println("Successfully sent email")
	return m, nil
}
