import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  ImageRun,
  Footer,
  UnderlineType,
  BorderStyle,
} from "docx";

const createHeading = (text) => {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    style: "aside",
  });
};

const normalParagraph = (text) => {
  return new Paragraph({
    text: text,
    style: "fontsStyle",
  });
};

const questionNameHead = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: true,
      }),
    ],
    style: "fontsStyle",
  });
};

const questionAnsUncat = (que, ans) => {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children: [
      new TextRun({
        text: que,
        bold: true,
      }),
      new TextRun({
        text: ans,
      }),
    ],
    style: "fontsStyle",
  });
};

const space = (value) => {
  return new Paragraph({
    spacing: {
      after: value,
    },
  });
};

export const create = (
  data,
  customerData,
  image,
  width,
  height,
  questionnaireProp
) => {
  let questionsArray = data.data;
  let backgroundColor = customerData.pdf_style.pdf_backgroundcolor.replace(
    "#",
    ""
  );

  const document = new Document({
    background: {
      color: backgroundColor,
    },

    styles: {
      paragraphStyles: [
        {
          id: "aside",
          name: "Aside",
          basedOn: "Normal",
          next: "Normal",
          run: {
            color: "313131",
            bold: true,
            font: "Inter",
          },
        },
        {
          id: "mainHead1",
          name: "MainHead1",
          basedOn: "Normal",
          next: "Normal",
          run: {
            color: "313131",
            bold: true,
            font: "Inter",
          },
        },
        {
          id: "mainHead2",
          name: "MainHead2",
          basedOn: "Normal",
          next: "Normal",
          run: {
            color: "313131",
            font: "Inter",
          },
        },
        {
          id: "fontsStyle",
          name: "fontsStyle",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Inter",
          },
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: Uint8Array.from(window.atob(image), (c) =>
                  c.charCodeAt(0)
                ),
                transformation: {
                  width: width,
                  height: height,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            spacing: {
              after: 50,
            },
          }),
          new Paragraph({
            text:
              data.questinnaireType_description != "" &&
              data.questinnaireType_description
                .replaceAll(/\r?\n|\r/g, "")
                .split("</p>").length != 0
                ? data.questinnaireType_description
                    .split("</p>")[0]
                    .replace(/(<([^>]+)>)/gi, "")
                    .replaceAll(/&nbsp;/gi, "")
                    .replaceAll(/\r?\n|\r/g, "")
                    .replaceAll(/\r?\n|\r/g, "")
                : "",
            heading: HeadingLevel.HEADING_1,
            style: "mainHead1",
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            text:
              data.questinnaireType_description != "" &&
              data.questinnaireType_description
                .replaceAll(/\r?\n|\r/g, "")
                .split("</p>").length > 1
                ? data.questinnaireType_description
                    .split("</p>")[1]
                    .replace(/(<([^>]+)>)/gi, "")
                    .replaceAll(/&nbsp;/gi, "")
                    .replaceAll(/\r?\n|\r/g, "")
                    .replaceAll(/\r?\n|\r/g, "")
                : "",
            heading: HeadingLevel.HEADING_2,
            style: "mainHead2",
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            border: {
              bottom: {
                color: "auto",
                space: 10,
                style: "single",
                size: 10,
              },
            },
          }),
          new Paragraph({
            spacing: {
              after: 50,
            },
          }),

          ...questionsArray
            .map((element) => {
              console.log(element);
              const arr = [];
              if (questionnaireProp.includes("UNCAT_VISIBLE")) {
                arr.push(
                  createHeading(
                    element.cat
                      .replaceAll(/(<([^>]+)>)/gi, "")
                      .replaceAll(/\r?\n|\r/g, "")
                  )
                );
                arr.push(space(50));
                element.questions.forEach((que) => {
                  if (que.answer) {
                    arr.push(
                      questionAnsUncat(
                        que.questionName
                          .replaceAll(/(<([^>]+)>)/gi, "")
                          .replaceAll(/\r?\n|\r/g, "") + ": ",
                        que.answer
                      )
                    );
                  } else if (que.values) {
                    arr.push(
                      questionNameHead(
                        que.questionName
                          .replaceAll(/(<([^>]+)>)/gi, "")
                          .replaceAll(/\r?\n|\r/g, "")
                      )
                    );

                    que.values.forEach((item) => {
                      let newVal = item.order + ". " + item.value.trim();
                      if (item.subanswer) {
                        newVal = newVal + " " + item.subanswer;
                      }
                      arr.push(normalParagraph(newVal));
                    });
                  }
                  if (que.explantionAnswer) {
                    arr.push(
                      questionAnsUncat("Explanation: ", que.explantionAnswer)
                    );
                  }
                });
                arr.push(space(50));
              } else {
                if (
                  element.cat
                    .replaceAll(/(<([^>]+)>)/gi, "")
                    .replaceAll(/\r?\n|\r/g, "") !== "Uncategorized"
                ) {
                  arr.push(
                    createHeading(
                      element.cat
                        .replaceAll(/(<([^>]+)>)/gi, "")
                        .replaceAll(/\r?\n|\r/g, "")
                    )
                  );
                  arr.push(space(50));
                  element.questions.forEach((que) => {
                    arr.push(
                      questionNameHead(
                        // que.order +
                        //   1 +
                        //   ". " +
                        que.questionName
                          .replaceAll(/(<([^>]+)>)/gi, "")
                          .replaceAll(/\r?\n|\r/g, "")
                      )
                    );

                    if (que.answer) {
                      arr.push(normalParagraph(que.answer));
                    } else if (que.values) {
                      que.values.forEach((item) => {
                        let newVal = item.order + ". " + item.value.trim();
                        if (item.subanswer) {
                          newVal = newVal + " " + item.subanswer;
                        }
                        arr.push(normalParagraph(newVal));
                      });
                    }
                    if (que.explantionAnswer) {
                      arr.push(
                        questionAnsUncat("Explanation: ", que.explantionAnswer)
                      );
                    }
                    arr.push(space(100));
                  });
                } else {
                  element.questions.forEach((que) => {
                    if (que.answer) {
                      arr.push(
                        questionAnsUncat(
                          que.questionName
                            .replaceAll(/(<([^>]+)>)/gi, "")
                            .replaceAll(/\r?\n|\r/g, "") + ": ",
                          que.answer
                        )
                      );
                    } else if (que.values) {
                      arr.push(
                        questionNameHead(
                          que.questionName
                            .replaceAll(/(<([^>]+)>)/gi, "")
                            .replaceAll(/\r?\n|\r/g, "")
                        )
                      );

                      que.values.forEach((item) => {
                        let newVal = item.order + ". " + item.value.trim();
                        if (item.subanswer) {
                          newVal = newVal + " " + item.subanswer;
                        }
                        arr.push(normalParagraph(newVal));
                      });
                    }
                    if (que.explantionAnswer) {
                      arr.push(
                        questionAnsUncat("Explanation: ", que.explantionAnswer)
                      );
                    }
                  });
                  arr.push(space(50));
                }
              }

              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),
        ],
      },
    ],
  });

  return document;
};
