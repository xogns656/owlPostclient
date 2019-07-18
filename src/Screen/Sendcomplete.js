import React, { Component } from "react";
import {
  Container,
  Text,
  Header,
  Footer,
  FooterTab,
  Button,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Icon,
  Picker,
  Content
} from "native-base";
import NumericInput from "react-native-numeric-input";
import { StyleSheet, Alert, AsyncStorage } from "react-native";
import { SERVER_API } from "../api/API";

const styles = StyleSheet.create({
  toplogo: {
    paddingTop: "1.4%",
    marginTop: "5.7%",
    backgroundColor: "black"
  },
  logotext: {
    paddingBottom: "3%",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },
  footer: {
    backgroundColor: "black"
  }
});

export default class Sendcomplete extends Component {
  constructor(props) {
    super(props); // --> slice 안 한 편지 통째로 내용을 받음.

    this.state = {
      messages: this.props.navigation.state.params.messages,
      meridiem: null,
      time: 0,
      minute: 0
    };
  }
  meridiemSelect = value => {
    this.setState({
      meridiem: value
    });
  };

  sendLetter = async () => {
    let { time, minute, meridiem } = this.state;
    const { nickname, partner_nickname } = this.props.navigation.state.params;
    const { navigation } = this.props;
    //console.log(nickname, partner_nickname);
    const token = await AsyncStorage.getItem("token");
    const changeString = val => {
      return val.toString().length === 1 ? "0" + val : val;
    };

    const now = new Date();
    now.setDate(now.getDate() + 1);

    let year = now
      .getFullYear()
      .toString()
      .slice(2);
    year = changeString(year);

    let month = now.getMonth() + 1;
    month = changeString(month);

    let day = now.getDate();
    day = changeString(day);

    time = changeString(time);
    meridiem === "AM" ? (time = time) : (time = Number(time) + 12);

    minute = changeString(minute);
    const arriveDate =
      month + "/" + day + "/" + year + "   " + time + ":" + minute;
    const sendData = {};
    sendData.from = nickname;
    sendData.to = partner_nickname;
    sendData.time = arriveDate;
    sendData.messages = this.state.messages;

    fetch(SERVER_API + `/check/letter-send`, {
      method: "POST",
      body: JSON.stringify(sendData),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        currtime: new Date().toString().slice(4, 15)
      }
    })
      .then(res => {
        console.log(res);
        if (res.status === 201) {
          return res.json();
        } else if (res.statue === 400) {
          return;
        }
      })
      .then(json => {
        Alert.alert("", json, [
          { text: "확인", onPress: () => navigation.navigate("Home") }
        ]);
      })
      .catch(err => console.log(err));
  };
  render() {
    const { hideAlert } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const { messages } = this.state;
    const elMeridiem = ["AM", "PM"];
    console.log(this.state.meridiem);
    //console.log(messages);
    return (
      <Container>
        <Header style={styles.toplogo}>
          <Icon
            style={{ color: "white" }}
            name="arrow-back"
            onPress={() => {
              hideAlert();
              navigation.goBack();
            }}
          />
          <Text style={styles.logotext}>owlPost</Text>
        </Header>

        <Text>부엉이의 도착시간을 정해주세요</Text>

        <Picker
          notemode="dropdown"
          selectedValue={this.state.meridiem}
          onValueChange={this.meridiemSelect}
        >
          {elMeridiem.map((curr, index) => (
            <Picker.Item key={curr.charCodeAt} label={curr} value={curr} />
          ))}
        </Picker>
        <Content>
          <NumericInput
            type="up-down"
            onChange={timeChange => this.setState({ time: timeChange })}
            minValue={0}
            maxValue={12}
          />
          <Text> 시 </Text>

          <NumericInput
            type="up-down"
            onChange={minChange => this.setState({ minute: minChange })}
            step={5}
            minValue={0}
            maxValue={59}
          />
          <Text> 분 </Text>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              style={styles.footer}
              onPress={() => {
                Alert.alert("", "부엉이를 보내시겠어요?", [
                  { text: "네", onPress: this.sendLetter },
                  { text: "아니오" }
                ]);
              }}
            >
              <Text>SEND</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
