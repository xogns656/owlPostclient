import React, { Component } from "react";
import {
  Container,
  Text,
  Header,
  Footer,
  FooterTab,
  Button
} from "native-base";

import { StyleSheet, TextInput, ScrollView, Alert } from "react-native";

import AwesomeAlert from "react-native-awesome-alerts";

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
  toptext: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "3%",
    marginTop: "3%"
  },
  lettertext: {
    fontSize: 20,
    marginLeft: "3%",
    marginTop: "7%"
  },
  footer: {
    backgroundColor: "black"
  },
  btntext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14
  }
});
export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = { showAlert: false, messages: null };
  }

  storeMessage = e => {
    const messages = e.nativeEvent.text;
    this.setState({
      messages: messages
    });
  };

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    const { navigation } = this.props;
    const { showAlert, messages } = this.state;
    const { nickname, partner_nickname } = this.props.navigation.state.params;
    //console.log(nickname, partner_nickname);
    return (
      <Container
      // 닉네임에 get 요청 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      >
        <Header style={styles.toplogo}>
          <Text style={styles.logotext}>owlPost</Text>
        </Header>
        <Text style={styles.toptext}>To. {partner_nickname}</Text>

        <ScrollView>
          <TextInput
            style={styles.lettertext}
            editable={true}
            maxLength={500}
            multiline={true}
            autoFocus={true}
            onChange={this.storeMessage}
          />
        </ScrollView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="편지를 보내시겠습니까?"
          message="I have a message for you!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, send it"
          confirmButtonColor="black"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            messages !== null
              ? navigation.navigate("Sendcomplete", {
                  messages: messages,
                  hideAlert: this.hideAlert,
                  nickname: nickname,
                  partner_nickname: partner_nickname
                })
              : Alert.alert("", "편지의 내용이 없으면 보낼수가 없어요!", [
                  {
                    text: "ok",
                    onPress: () =>
                      this.setState({
                        showAlert: false
                      })
                  }
                ]);
          }}
        />

        <Footer>
          <FooterTab>
            <Button
              style={styles.footer}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Text style={styles.btntext}>Main</Text>
            </Button>
            <Button
              style={styles.footer}
              onPress={() => {
                this.showAlert();
              }}
            >
              <Text style={styles.btntext}>Send</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
