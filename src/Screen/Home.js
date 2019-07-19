import React, { Component } from "react";
import {
  Text,
  Container,
  Header,
  Footer,
  FooterTab,
  Button,
  Icon
} from "native-base";
import { StyleSheet, AsyncStorage } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { SERVER_API } from "../api/API";
//const ServerURL;

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
  maintext: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "50%"
  },
  subtext: {
    marginTop: "3%",
    textAlign: "center",
    fontSize: 20
  },
  footer: {
    backgroundColor: "black"
  },
  timer: {
    marginTop: "3%",
    textAlign: "center",
    fontSize: 17
  }
});

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centerText: "HELLO OWLS!",
      subText: "당신의 펜팔친구를 찾아보세요!",
      matchStatus: "매칭시작",
      // 매칭 버튼을 누르면 메인 텍스트와 서브 텍스트를 변경한다.
      // 매칭 버튼을 누르면 서버에 post 요청 -> db에 partnerId가 null인
      // 상대와 서로를 추가한다.
      // 포스트 요청에 따라 푸시요청??
      partner: " ", //  현재 fake값 , null에서 요청으로 받는 값으로 쓸 예정
      matchComplete: false,
      // fetch res.partnerNickName 이 null ? true : false
      // 매칭완료이면 true , 매칭 전, 대기 중에는 false
      // 매칭버튼 변경 . 기본 텍스트에서 상대방 닉네임으로 변경
      postStatus: false,
      // fetch res.date ? null ? true : false
      // 상대가 편지를 보냈으면 true , default = false -> true 면 또 변경.
      arriveTime: null, //  현재 fake값 , null에서 요청으로 받는 값으로 쓸 예정
      // get 요청으로 받을 값이 들어갈 예정.
      date: null,
      // 여기에 도착예정 시간과 현재시간을 계산한 카운터 값이 들어가거나 , 편지도착알림 텍스트가 띄워진다.
      showAlert: false,
      // true 일 때 alert , 편지시간이 되면 true로 되고 date는 다시 null.
      check: null,
      sendStatus: true
    };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  async componentDidMount() {
    let AllUserInfo = `${SERVER_API}/check/home`;
    const token = await AsyncStorage.getItem("token");
    this.setState({
      token: token
    });
    fetch(AllUserInfo, {
      headers: {
        "x-access-token": token
      }
    })
      .then(res => res.json())
      .then(res => {
        //console.log("!!!!!!!!!", res);
        //console.log("precheck", this.state.check);
        if (res.user.partner_nickname === null) {
          this.setState({
            matchComplete: false,
            myname: res.user.nickname
          });
          if (this.state.matchStatus === "매칭 중") {
            this.setState({
              matchStatus: "매칭 중",
              myname: res.user.nickname
            });
          } else {
            this.setState({
              matchStatus: "매칭시작",
              myname: res.user.nickname
            });
          }
        } else {
          this.setState({
            // 편지는 계속 비교
            matchComplete: true
          });
          if (res.user.letterSendtime !== new Date().toString().slice(4, 15)) {
            //console.log("니가 뛰냐??");
            this.setState({
              sendStatus: true
            });
            if (this.state.sendStatus) {
              this.setState({
                partner: res.user.partner_nickname,
                matchStatus: "편지 쓰기",
                myname: res.user.nickname
              });
            }
          } else {
            this.setState({
              sendStatus: false
            });
            if (this.state.sendStatus) {
              this.setState({
                // 편지는 계속 비교
                partner: res.user.partner_nickname,
                matchStatus: "전송 완료",
                myname: res.user.nickname
              });
            }
          }
        }

        if (res.letters.length && this.state.check === null) {
          //   console.log(res);
          this.setState({
            check: res.letters,
            arriveTime: res.letters[res.letters.length - 1].time
          });
        } else if (res.letters.length && this.state.check !== null) {
          this.setState({
            check: res.letters,
            arriveTime: res.letters[res.letters.length - 1].time
          });
        }
      })
      .catch(err => console.log(err));

    setInterval(() => {
      fetch(AllUserInfo, {
        headers: {
          "x-access-token": token
        }
      })
        .then(res => res.json())
        .then(res => {
          //   console.log(res);
          if (res.user.partner_nickname === null) {
            this.setState({
              matchComplete: false,
              myname: res.user.nickname
            });
            if (this.state.matchStatus === "매칭 중") {
              this.setState({
                matchStatus: "매칭 중",
                myname: res.user.nickname
              });
            } else {
              this.setState({
                matchStatus: "매칭시작",
                myname: res.user.nickname
              });
            }
          } else {
            this.setState({
              // 편지는 계속 비교
              matchComplete: true
            });
            if (
              res.user.letterSendtime !== new Date().toString().slice(4, 15)
            ) {
              this.setState({
                sendStatus: true
              });
              if (this.state.sendStatus) {
                //console.log("니가 뛰냐??");
                this.setState({
                  partner: res.user.partner_nickname,
                  matchStatus: "편지 쓰기",
                  myname: res.user.nickname
                });
              }
            } else {
              this.setState({
                sendStatus: false
              });
              if (!this.state.sendStatus) {
                //console.log("아니아니아니면 니가 뛰냐??");
                this.setState({
                  // 편지는 계속 비교
                  partner: res.user.partner_nickname,
                  matchStatus: "전송 완료",
                  myname: res.user.nickname
                });
              }
            }
          }
          if (res.letters.length && this.state.check === null) {
            //   console.log(res);
            this.setState({
              check: res.letters,
              arriveTime: res.letters[res.letters.length - 1].time
            });
          } else if (res.letters.length && this.state.check !== null) {
            this.setState({
              check: res.letters,
              arriveTime: res.letters[res.letters.length - 1].time
            });
          }
          //console.log("!@!@!@", this.state);
        })
        .catch(err => console.log(err));
    }, 2000);

    let x = setInterval(() => {
      if (this.state.arriveTime) {
        //console.log(this.state.arriveTime);
        let aTime = new Date(this.state.arriveTime).getTime();
        let currTime = new Date().getTime();
        let timerStart = aTime - currTime;

        if (timerStart > 0) {
          this.setState({
            postStatus: true
          });
          let arrive = this.state.arriveTime; //여기 슬라이스
          //console.log(times, "---", today, "---", arrive);
          var deadline = new Date(arrive).getTime();
          var now = new Date().getTime();
          let t = deadline - now;
          let days = Math.floor(t / (1000 * 60 * 60 * 24));
          let hours = Math.floor(
            (t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));

          this.setState({
            date:
              "편지 도착까지, " +
              days +
              "일 " +
              hours +
              "시간 " +
              minutes +
              "분"
          });
        } else if (this.state.postStatus && timerStart <= 0) {
          clearInterval(x);
          this.setState({
            date: null,
            postStatus: false
          });
          this.setState({
            showAlert: true
          });
        }
      }
    }, 2000);
  }

  render() {
    const {
      centerText,
      subText,
      matchStatus,
      matchComplete,
      partner,
      date,
      postStatus,
      showAlert
    } = this.state;

    const { navigation } = this.props;

    return (
      <Container>
        <Header style={styles.toplogo}>
          <Text style={styles.logotext}>owlPost</Text>
        </Header>

        <Container>
          {matchComplete === false ? (
            <Text style={styles.maintext}>{centerText}</Text>
          ) : (
            <Text style={styles.maintext}>My penpal : '{partner}'!</Text>
          )}

          {matchComplete === false ? (
            <Text style={styles.subtext}>{subText}</Text>
          ) : (
            <Text style={styles.subtext}>하루 한 통, 마음을 전해보세요.</Text>
          )}
          {postStatus === true ? (
            <Text style={styles.timer}>{date}</Text>
          ) : null}
        </Container>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="편지가 도착했어요!"
          message="Postbox에서 확인해보세요!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText=""
          confirmText="📩"
          confirmButtonColor="black"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.setState({
              postStatus: false
            });
            this.hideAlert();
          }}
        />
        <Footer>
          <FooterTab>
            <Button
              style={styles.footer}
              onPress={() => {
                navigation.navigate("Postbox");
              }}
            >
              <Text>편지함</Text>
            </Button>
            <Button
              style={styles.footer}
              onPress={() => {
                if (matchComplete === false) {
                  this.setState({
                    centerText: "FIND FRIEND!",
                    subText: "펜팔친구를 찾고 있어요!",
                    matchStatus: "매칭 중"
                  });
                  setInterval(() => {
                    fetch(
                      `${SERVER_API}/check/match?nickname=${this.state.myname}`,
                      {
                        // ---------------> ㅁㅐ칭요청
                        method: "POST",
                        headers: {
                          "x-access-token": this.state.token
                        }
                      }
                    )
                      .then(res => {
                        console.log("res->", res, "token->", this.state.token);
                      })
                      .catch(err => console.log(err));
                  }, 10000);
                } else {
                  if (matchStatus === "편지 쓰기") {
                    navigation.navigate("Send", {
                      nickname: this.state.myname,
                      partner_nickname: this.state.partner
                    });
                  }
                }
              }}
            >
              <Text>{matchStatus}</Text>
            </Button>
            <Button
              style={styles.footer}
              onPress={() => {
                navigation.navigate("Mypage");
              }}
            >
              <Text>마이페이지</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

/*

*/
