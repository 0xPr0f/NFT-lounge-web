import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import ClockLoader from "react-spinners/ClockLoader";

const Background = styled.div`
  width: 100%;
  height: 1000rem;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 500px;
  height: 370px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.4);
  background: #fff;
  color: #000;
  display: grid;

  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  position: absolute;

  flex-direction: column;
  top: 30px;
  left: 50px;
  line-height: 1.8;
  color: #141414;
  h1 {
    margin-bottom: 1rem;
  }
  button {
    position: fixed;

    bottom: 25px;
    right: 55px;

    padding: 8px 12px;
    background: #007aff;
    color: #fff;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
`;
//onClick={closeModal} ref={modalRef}
const Modal = ({ showModal, setShowModal, fileUrl, txHash, setTxHash }) => {
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(
    () => {
      setLoading(true);
      // setTxHash(null);
    },
    () => {
      if (txHash !== null) {
        setLoading(false);
        console.log("stopped spinning");
      }
    }
  );
  const modalRef = useRef();

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(-80%)`,
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };
  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        console.log("I pressed");
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);
  console.log(txHash);
  return (
    <>
      {showModal ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            bottom: "450px",
          }}
        >
          <Background onClick={closeModal} ref={modalRef}>
            <animated.div style={animation}>
              <ModalWrapper showModal={showModal}>
                <ModalContent>
                  {}
                  <h1
                    className=" m-1"
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyItems: "center",
                      position: "relative",
                    }}
                  >
                    Please DO NOT close this tab <br /> &nbsp; &nbsp; &nbsp; or
                    interupt the process.
                  </h1>

                  <u>
                    {fileUrl !== null ? (
                      <>
                        <p
                          className="text-xl m-1"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            window.open(`${fileUrl}`, "_blank");
                          }}
                        >
                          View NFT URL here 👈
                        </p>
                      </>
                    ) : null}
                  </u>
                  <p>😊😊😊😊😊😊😊😊😊😊</p>
                  {fileUrl !== null ? (
                    <>
                      {" "}
                      <a className="text-xl m-3.5">
                        {" "}
                        Confirming 2 Transactions...
                      </a>
                    </>
                  ) : null}

                  {txHash !== null ? (
                    <>
                      <h1>
                        <p
                          style={{
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          onClick={() => {
                            window.open(`${txHash}`, "_blank");
                          }}
                        >
                          <u>Transaction on the polygon testnet 👈</u>
                        </p>
                      </h1>
                    </>
                  ) : null}
                  {loading && fileUrl !== null ? (
                    <>
                      <ClockLoader
                        color="#007aff"
                        loading={loading}
                        size={40}
                      />
                      <br />
                    </>
                  ) : null}
                  <button onClick={() => setShowModal((prev) => !prev)}>
                    Close
                  </button>
                </ModalContent>

                <CloseModalButton
                  aria-label="Close modal"
                  onClick={() => setShowModal((prev) => !prev)}
                />
              </ModalWrapper>
            </animated.div>
          </Background>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
