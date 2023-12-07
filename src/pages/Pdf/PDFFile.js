import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  BlobProvider,
  Font,
  Image,
} from "@react-pdf/renderer";
import { useState } from "react";
import { useEffect } from "react";

const PDFFile = (props) => {
  Font.register({
    family: "Inter, sans-serif",
    fonts: [
      { src: "/assets/fonts/Inter-Regular.ttf" },
      { src: "/assets/fonts/Inter-Medium.ttf", fontWeight: 500 },
      { src: "/assets/fonts/Inter-SemiBold.ttf", fontWeight: 600 },
      { src: "/assets/fonts/Inter-Bold.ttf", fontWeight: 700 },
    ],
  });
  const styles = StyleSheet.create({
    page: {
      backgroundColor: props.data.customerData.pdf_style.pdf_backgroundcolor,
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 20,
      paddingBottom: 0,
      fontSize: 11,
      fontWeight: 400,
      fontFamily: "Inter, sans-serif",
      paddingBottom: 90,
      lineHeight: 1.3,
    },

    questionhead: {
      fontWeight: 500,
      minWidth: 150,
    },
    image: {
      width: 130,
      marginLeft: "auto",
      marginRight: "auto",
      height: 60,
      objectFit: "contain",
      marginBottom: 20,
    },
    title: {
      color: props.data.customerData.pdf_style.pdf_titlecolor,
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 5,
      textAlign: "center",
    },
    subTitle: {
      fontSize: 10,
      marginBottom: 15,
      textAlign: "center",
    },
    cat: {
      marginBottom: 10,
      marginTop: 15,
      fontWeight: 600,
    },
    userInfo: {
      borderBottom: 1,
      borderColor: "#ddd",
      marginTop: 10,
      fontSize: 10,
    },
    questionWrap: {
      marginBottom: 15,
    },
    answer: {
      fontSize: 11,
      marginTop: 5,
      lineHeight: 1.5,
      marginLeft: 11,
    },
    answerInr: {
      display: "block",
    },
    explanation: {
      fontSize: 11,
      fontWeight: 600,
      marginLeft: 11,
    },
    userWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    userWrapInr: {
      flexGrow: 0,
      flexShrink: 1,
      width: "50%",
      marginBottom: 5,
    },
    footer: {
      borderBottom: 5,
      borderColor: props.data.customerData.pdf_style.pdf_headercolor,
      position: "fixed",
      bottom: -13,
      left: 0,
      right: 0,
    },
    pageNumber: {
      position: "fixed",
      fontSize: 10,
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: "center",
    },
    footerMain: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    companyName: {
      position: "absolute",
      bottom: 10,
      left: 15,
      fontSize: 10,
    },
    year: {
      position: "absolute",
      bottom: 10,
      right: 15,
      fontSize: 10,
    },
  });

  const [mainData, setMainData] = useState(
    props.data.data.length > 0 ? props.data.data[0] : []
  );
  let questionnaireProp = props.data.questionnaireProp;

  console.log(props);
  useEffect(() => {
    setMainData(props.data.data.length > 0 ? props.data.data[0] : {});
  }, [props]);

  return (
    <Document>
      {mainData ? (
        <Page size="A4" style={styles.page}>
          <Image
            src={
              props.data.customerData.pdf_style
                ? props.data.customerData.pdf_style.pdf_logo
                : ""
            }
            style={styles.image}
            fixed
          />
          {Object.keys(mainData).length > 0 ? (
            <>
              <View>
                {/* <Text>
                {mainData.questionnaireType
                  .replaceAll(/(<([^>]+)>)/gi, "")
                  .replaceAll(/\r?\n|\r/g, "")}
              </Text> */}
                <Text style={styles.title}>
                  {mainData.questinnaireType_description != "" &&
                  mainData.questinnaireType_description
                    .replaceAll(/\r?\n|\r/g, "")
                    .split("</p>").length != 0
                    ? mainData.questinnaireType_description
                        .split("</p>")[0]
                        .replace(/(<([^>]+)>)/gi, "")
                        .replaceAll(/&nbsp;/gi, "")
                        .replaceAll(/\r?\n|\r/g, "")
                    : ""}
                </Text>
                <Text style={styles.subTitle}>
                  {mainData.questinnaireType_description != "" &&
                  mainData.questinnaireType_description
                    .replaceAll(/\r?\n|\r/g, "")
                    .split("</p>").length > 1
                    ? mainData.questinnaireType_description
                        .split("</p>")[1]
                        .replace(/(<([^>]+)>)/gi, "")
                        .replaceAll(/&nbsp;/gi, "")
                        .replaceAll(/\r?\n|\r/g, "")
                    : ""}
                </Text>
              </View>
              {mainData.data
                .sort((a, b) => a.order - b.order)
                .map((item, i) => (
                  <View key={i + "que"} style={styles.pdfBody}>
                    {questionnaireProp.includes("UNCAT_VISIBLE") ? (
                      <Text style={styles.cat}>
                        {item.cat.replace(/(<([^>]+)>)/gi, "")}
                      </Text>
                    ) : item.cat
                        .replaceAll(/(<([^>]+)>)/gi, "")
                        .replaceAll(/\r?\n|\r/g, "") !== "Uncategorized" ? (
                      <Text style={styles.cat}>
                        {item.cat.replace(/(<([^>]+)>)/gi, "")}
                      </Text>
                    ) : (
                      ""
                    )}

                    <View>
                      {item.cat
                        .replaceAll(/(<([^>]+)>)/gi, "")
                        .replaceAll(/\r?\n|\r/g, "") === "Uncategorized" ? (
                        <View style={styles.userWrap}>
                          {item.questions
                            .sort((a, b) => a.order - b.order)
                            .map((que, j) => (
                              <View key={j + "que2"} style={styles.userWrapInr}>
                                {item.cat
                                  .replaceAll(/(<([^>]+)>)/gi, "")
                                  .replaceAll(/\r?\n|\r/g, "") ===
                                "Uncategorized" ? (
                                  <Text>
                                    {item.cat
                                      .replaceAll(/(<([^>]+)>)/gi, "")
                                      .replaceAll(/\r?\n|\r/g, "") ===
                                    "Uncategorized" ? (
                                      <Text>
                                        <Text style={styles.questionhead}>
                                          {que.questionName.replace(
                                            /(<([^>]+)>)/gi,
                                            ""
                                          )}{" "}
                                          :
                                        </Text>
                                        {"answer" in que ? (
                                          <Text>
                                            {que.answer
                                              .toString()
                                              .replace(/(<([^>]+)>)/gi, "")}
                                          </Text>
                                        ) : (
                                          ""
                                        )}
                                      </Text>
                                    ) : (
                                      ""
                                    )}
                                  </Text>
                                ) : (
                                  ""
                                )}
                              </View>
                            ))}
                        </View>
                      ) : (
                        <View>
                          {item.questions
                            .sort((a, b) => a.order - b.order)
                            .map((que, j) => (
                              <View key={j + "que2"}>
                                <View style={styles.questionWrap}>
                                  {item.cat
                                    .replaceAll(/(<([^>]+)>)/gi, "")
                                    .replaceAll(/\r?\n|\r/g, "") !==
                                  "Uncategorized" ? (
                                    <>
                                      <Text style={styles.questionhead}>
                                        {/* {que.order + 1 + ". "} */}
                                        {que.questionName.replace(
                                          /(<([^>]+)>)/gi,
                                          ""
                                        )}{" "}
                                      </Text>
                                      <View style={styles.answer}>
                                        {item.cat
                                          .replaceAll(/(<([^>]+)>)/gi, "")
                                          .replaceAll(/\r?\n|\r/g, "") !==
                                          "Uncategorized" && "answer" in que ? (
                                          <Text>
                                            {que.answer
                                              .toString()
                                              .replace(/(<([^>]+)>)/gi, "")}
                                          </Text>
                                        ) : "values" in que ? (
                                          que.values
                                            .sort((a, b) => a.order - b.order)
                                            .map((value, j) => (
                                              // value.order +
                                              // ". " +

                                              <Text key={"val_" + j}>
                                                {value.order +
                                                  ". " +
                                                  value.value.trim() +
                                                  " " +
                                                  (value.subanswer
                                                    ? value.subanswer
                                                    : "")}
                                              </Text>
                                            ))
                                        ) : (
                                          ""
                                        )}
                                      </View>{" "}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  <Text style={styles.explanation}>
                                    {"explantionAnswer" in que
                                      ? "Explanation: " + que.explantionAnswer
                                      : ""}
                                  </Text>
                                </View>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>

                    <View>
                      {item.cat
                        .replaceAll(/(<([^>]+)>)/gi, "")
                        .replaceAll(/\r?\n|\r/g, "") === "Uncategorized" ? (
                        <Text style={styles.userInfo}></Text>
                      ) : (
                        ""
                      )}
                    </View>
                  </View>
                ))}

              <View fixed style={styles.footerMain}>
                <Text style={styles.footer}></Text>
                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber} / ${totalPages}`
                  }
                />
                <Text style={styles.companyName}>
                  {props.data.customerData.companydata.name}
                </Text>
                <Text style={styles.year}>{new Date().getFullYear()}</Text>
              </View>
            </>
          ) : (
            ""
          )}
        </Page>
      ) : (
        ""
      )}
    </Document>
  );
};

export default PDFFile;
