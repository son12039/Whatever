import SockJs from "sockjs-client";
import StompJs from "stompjs";
//stomp와 sockjs 패키지로 깔고 임포트!!

const sock = new SockJs("/websocket");
//client 객체 생성 및 서버주소 입력

const stomp = StompJs.over(sock);
//stomp로 감싸기

const stompConnect = () => {
  try {
    stomp.debug = null;
    //웹소켓 연결시 stomp에서 자동으로 connect이 되었다는것을
    //console에 보여주는데 그것을 감추기 위한 debug

    stomp.connect(token, () => {
      stomp.subscribe(
        `서버주소`,
        (data) => {
          const newMessage = JSON.parse(data.body);
          //데이터 파싱
        },
        token
      );
    });
  } catch (err) {}
};

//웹소켓 connect-subscribe 부분

const stompDisConnect = () => {
  try {
    stomp.debug = null;
    stomp.disconnect(() => {
      stomp.unsubscribe("sub-0");
    }, token);
  } catch (err) {}
};
//웹소켓 disconnect-unsubscribe 부분
// 웹소켓을 disconnect을 따로 해주지 않으면 계속 연결되어 있어서 사용하지 않을때는 꼭 연결을 끊어주어야한다.

const SendMessage = () => {
  stomp.debug = null;
  const data = {
    type: "TALK",
    roomId: roomId,
    sender: sender_nick,
    message: message,
    createdAt: now,
  };
  //예시 - 데이터 보낼때 json형식을 맞추어 보낸다.
  stomp.send("/pub/chat/message", token, JSON.stringify(data));
};
//웹소켓 데이터 전송 부분
