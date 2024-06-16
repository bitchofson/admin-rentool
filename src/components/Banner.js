import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import headerImg from '../assets/img/logox.png';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(100 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ['Воплощайте идеи в реальность, вместе мы строим будущее!', 'Наша цель - превосходить ожидания клиентов!', 'Создаем, разрабатываем, улучшаем - движемся к вершинам!'];
  const period = 1000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(100);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? 'animate__animated animate__fadeIn' : ''}>
                  <span className="tagline">Добро пожаловать в админ-панель RenTool</span>
                  <h1>
                    <span className="txt-rotate" dataPeriod="500" data-rotate='[ "Воплощайте идеи в реальность, вместе мы строим будущее!", "Наша цель - превосходить ожидания клиентов!", "Создаем, разрабатываем, улучшаем - движемся к вершинам!" ]'>
                      <span className="wrap">{text}</span>
                    </span>
                  </h1>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? 'animate__animated animate__zoomIn' : ''}>
                  <img src={headerImg} alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>

        <button onClick={() => window.open('https://github.com/BuchnevDmitry/tp-9.2/tree/main/', '_blank')} className="get-started-button">
          Проект <ArrowRightCircle size={25} />
        </button>


      </Container>

    </section>
  );
};
