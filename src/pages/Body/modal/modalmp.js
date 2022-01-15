import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import ClockLoader from "react-spinners/ClockLoader";
const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 500px;
  height: 330px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  position: absolute;
  top: -15rem;
  right: 11rem;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  left: 70px;

  bottom: 40px;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #007aff;
    color: #fff;
    position: fixed;
    right: 200px;
    bottom: 255px;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;
//onClick={closeModal} ref={modalRef}
const Modalmp = ({
  showModal,
  setShowModal,
  txHash,
  setTxHash,
  Items,
  setItems,
}) => {
  const [loading, setLoading] = useState(false);
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
  if (txHash !== null) {
    console.log("stopp spinning");
  }
  if (showModal === true) {
    console.log("{setLoading(false)}");
  }
  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
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
  if (Items !== null) {
    var no = "ID = " + Items;
  }
  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              <ModalContent>
                <h1
                  className=" m-1"
                  style={{
                    margin: "0.1rem",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyItems: "center",
                    position: "relative",
                  }}
                >
                  Please DO NOT close this tab
                </h1>
                <p
                  style={{
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyItems: "center",
                    position: "relative",
                  }}
                >
                  or interupt the process.
                </p>
                <h1 className="text- m-2">Purchasing NFT... NFT {no}</h1>

                {console.log(`https://mumbai.polygonscan.com/tx/${txHash}`)}
                {txHash !== null ? (
                  <>
                    <h1>
                      <p
                        style={{
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        onClick={() => {
                          window.open(
                            `https://mumbai.polygonscan.com/tx/${txHash}`,
                            "_blank"
                          );
                        }}
                      >
                        <u>Transaction on the polygon testnet 👈</u>
                      </p>
                    </h1>
                    <h1 className="text-xl">
                      This will automatically close when done 🙂
                    </h1>

                    <br />
                  </>
                ) : null}
                <ClockLoader color="#007aff" loading={loading} size={40} />
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
      ) : null}
    </>
  );
};

export default Modalmp;
