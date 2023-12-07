import { PDFDownloadLink } from "@react-pdf/renderer";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { create } from "../Doc/Cvgenerator";
import { Helmet } from "react-helmet";

import {
  GetQuestionnaireCat,
  getQuestionsbyid,
  generatePDF,
  saveAnswer,
  answerList,
  getListAnswer,
} from "../../actions/questioerAction";
import actionTypes from "../../constants/actionTypes";
import CustomLoader from "../Customloader";
import PDFdata from "../Pdf/PDFdata";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import Tippy from "@tippyjs/react";
import CommonModal from "../../common/CommonModal";
import { checkEmptyObjectOrarray } from "../../actions/commonActions";

const QuestionnaireView = (props) => {
  let todayDate = "";
  const date = new Date();
  console.log(date.getDate());
  const defaultToday =
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString() +
    "-" +
    date.getDate().toString();

  console.log(defaultToday);
  const [error, setCustomerror] = useState({});
  const message = useSelector((state) => state.toasterReducer);
  const ref = useRef(null);
  const btnPopup = useRef(null);
  const formRef = useRef();
  const locale = props.locale;
  let selectedCustomer = useSelector(
    (state) => state.switchCustomerReducer
  ).selectedCustomer;
  const answers = useSelector((state) => state.answerReducer);
  const answerData = answers.answerData;

  const pendingAnswer = answers.pending;

  const answerListNew = useSelector((state) => state.answerReducer).answerList;
  const customerData = useSelector((state) => state.switchCustomerReducer);
  if (["customer"].includes(props.auth.role)) {
    selectedCustomer = JSON.parse(localStorage.getItem("customerdata"));
  } else {
    if (Object.keys(customerData.selectedCustomer).length === 0) {
      selectedCustomer = customerData.customerList[0];
      console.log(selectedCustomer);
    }
  }

  const checkifchecked = (e, values) => {
    console.log(formRef.current);
    if (e.target.type === "radio") {
      const { name, value, checked } = e.target;
      values[name] = value;
      // console.log(e.target.id);
      if (checked) {
        e.target.checked = false;
        delete values[name];
      }
      // console.log(checked);
      // // setansObj(...values);
      // console.log(ansObj);
    }
    // if (e.target.checked) {
    //   document.getElementById(e.target.id).setAttribute("checked", false);
    // }

    // if (e.target.value != "") {
    //   e.target.value = "";
    // }
    // e.target.checked = false;
    // console.log(e.target.checked);
  };
  console.log(selectedCustomer);
  const handlePopup = (formRef1) => {
    if (formRef.current) {
      if (Object.keys(formRef.current.values).length > 0) {
        console.log(formRef.current);
        let openPopup = false;
        for (const key in formRef.current.values) {
          if (formRef.current.values[key] !== "") {
            openPopup = true;
          }
        }
        if (openPopup) {
          btnPopup.current.click();
        } else {
          dispatch({
            type: actionTypes.ERROR_MESSAGE,
            payload: locale.Please_fill_the_form_first,
          });
        }
      } else {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: locale.Please_fill_the_form_first,
        });
      }
    }
  };
  const params = useParams();
  const id = params.id;

  const [ansObj, setansObj] = useState({});
  let count = 1;
  let countCat = 1;
  const formData = useSelector(
    (state) => state.viewQuestionnaireReducer
  ).questionnaireData;
  console.log(formData);

  // formData.data.map((element, i))=>{

  // }
  const [fmlTitle, setfmlTitle] = useState("");
  const [questionnaireTitle, setquestionnaireTitle] = useState("");
  useEffect(() => {
    let questionnaireTitlein = "";
    if (checkEmptyObjectOrarray(formData)) {
      questionnaireTitlein =
        formData.questinnaireType_description != "" &&
        formData.questinnaireType_description.split("</p>").length != 0
          ? formData.questinnaireType_description
              .split("</p>")[0]
              .replace(/(<([^>]+)>)/gi, "")
              .replaceAll(/&nbsp;/gi, "")
          : "";
      setquestionnaireTitle(questionnaireTitlein);
      setfmlVariableTitle(questionnaireTitlein);
      if (formData.questionnaireAttributes !== null) {
        formData.questionnaireAttributes.forEach((item) => {
          if (item.key === "FML_TITLE") {
            setfmlTitle(item.value);
          }
        });
      }
    }
  }, [formData]);

  let questionnaireProp = [];
  let fileNoID = 0;
  let newObj = {};

  if (checkEmptyObjectOrarray(formData)) {
    if (formData.questionnaireAttributes !== null) {
      formData.questionnaireAttributes.forEach((item) => {
        if (item.value === "1") {
          questionnaireProp.push(item.key);
        }
      });
    }
    if (formData.data.length > 0) {
      formData.data.forEach((allQuestions) => {
        allQuestions.questions.forEach((que) => {
          let queName = que.questionName
            .replace(/(<([^>]+)>)/gi, "")
            .replace(" ", "")
            .toLowerCase();
          if (
            queName === "fileno" ||
            queName === "dossiernr" ||
            queName === "fileno." ||
            queName === "dossiernr."
          ) {
            fileNoID = que.question_id;
          }
          if (que.type === "RadioButtons" || que.type === "Checkboxes") {
            if (que.type === "Checkboxes") {
              newObj["answer_" + que.question_id] = [
                que.values[0].value_id.toString(),
              ];
            } else {
              newObj["answer_" + que.question_id] =
                que.values[0].value_id.toString();
            }
          }
        });
      });
    }
  }
  const [fmlVariableTitle, setfmlVariableTitle] = useState(questionnaireTitle);
  const [fmlBtntext, setfmlBtnText] = useState(locale.To_FML);

  useEffect(() => {
    setfmlBtnText(locale.To_FML);
  }, [locale]);
  const toFML = () => {
    if (fmlBtntext === locale.To_FML) {
      setfmlBtnText(locale.To_KFML);

      setfmlVariableTitle(fmlTitle);
      console.log(newObj);
      if (formRef.current.values) {
        localStorage.setItem(
          "kfmlValue",
          JSON.stringify(formRef.current.values)
        );
        let currentValue = formRef.current.values;
        for (const key in newObj) {
          if (!currentValue.hasOwnProperty(key)) {
            currentValue[key] = newObj[key];
          }
        }
        setansObj({ ...currentValue });
        console.log(currentValue);
      }
    } else {
      console.log(questionnaireTitle);
      setfmlVariableTitle(questionnaireTitle);
      let oldValue = JSON.parse(localStorage.getItem("kfmlValue"));
      setansObj({ ...oldValue });
      setfmlBtnText(locale.To_FML);
    }
  };

  const generateDoctype = (data, selectCustomer, image, width, height) => {
    const doc = create(
      data,
      selectCustomer,
      image,
      width,
      height,
      questionnaireProp
    );

    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        (
          data.questionnaireType +
          "-" +
          new Date().getDate() +
          "-" +
          new Date().getMonth() +
          "-" +
          new Date().getFullYear()
        ).replaceAll(" ", "_") + ".docx"
      );
    });
  };

  const categoryList = useSelector(
    (state) => state.questionnaireReducer
  ).questionnaireCatlist;

  const pending = useSelector(
    (state) => state.viewQuestionnaireReducer
  ).pending;
  const pdfData = useSelector((style) => style.pdfReducer);
  const docData = useSelector((style) => style.docReducer).docData;
  const pdfContent = pdfData.pdfData;

  const [generatePdf, setPdfGenerate] = useState(false);
  const [saveForm, setsaveForm] = useState(false);
  const [generateDoc, setDocGenerate] = useState(false);
  const [formikObj, setformikobj] = useState({});
  // useEffect(() => {
  //   if (Object.keys(formData).length > 0) {
  //     formData.data.forEach((element, i) => {
  //       element.questions.forEach((que, j) => {
  //         if (que.type === "RadioButtons" || que.type === "Checkboxes") {
  //           que.values.forEach((options, k) => {
  //             if (que.type === "RadioButtons") {
  //               formikObj["answer_" + que.question_id] = "";
  //             } else if (que.type === "Checkboxes") {
  //               formikObj["answer_" + que.question_id] = [];
  //             }

  //             if (options.subanswer) {
  //               formikObj[
  //                 "subanswer_" + que.question_id + "_" + options.value_id
  //               ] = "";
  //             }
  //           });
  //         } else {
  //           if (que.type === "TextArea") {
  //             formikObj["textarea_" + que.question_id] = "";
  //           } else if (que.type === "TextInput") {
  //             formikObj["text_" + que.question_id] = "";
  //           } else if (que.type === "NumberInput") {
  //             formikObj["text_" + que.question_id] = "";
  //           } else if (que.type === "DatePicker") {
  //             formikObj["text_" + que.question_id] = "";
  //           }
  //         }
  //         if (que.explanation_box) {
  //           formikObj["explantion_" + que.question_id] = "";
  //         }
  //       });
  //     });

  //     setformikobj(formikObj);
  //
  //   }
  // }, [formData]);

  const getBase64Image = (imgUrl, callback) => {
    var img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png"),
        dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

      callback(dataURL); // the base64 string
    };

    // set attributes and src
    img.setAttribute("crossOrigin", "anonymous"); //
    img.src = imgUrl;
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getQuestionsbyid(id));
    dispatch(GetQuestionnaireCat());
    dispatch(
      answerList({ user_id: props.auth.userdata.id, questionnaire_type: id })
    );
    dispatch({ type: actionTypes.REMOVE_ANSWER_DATA });
  }, [id]);

  useEffect(() => {
    if (ref.current !== null) {
      if (pdfContent.length > 0 && pdfContent[0] !== undefined) {
        setTimeout(() => {
          // ref.current.click();
          document.getElementById("pdf_btn").click();
        }, 2000);
      }
    }
  }, [pdfData]);
  useEffect(() => {
    if (docData.length > 0 && docData[0] !== undefined) {
      let imageBase64 = "";
      let selectedLogourl = selectedCustomer.pdf_style.pdf_logo;
      getBase64Image(selectedLogourl, function (base64image) {
        imageBase64 = base64image;
      });

      const img = new Image();

      img.src = selectedLogourl;
      let imgWidth = "100";
      let imgHeight = "100";
      img.onload = function () {
        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;
      };

      setTimeout(() => {
        generateDoctype(
          docData[0],
          selectedCustomer,
          imageBase64,
          imgWidth,
          imgHeight
        );
      }, 2000);
    }
  }, [docData]);
  const [rDate, setRdate] = useState("");
  const expandList = (e) => {
    e.currentTarget.parentNode.classList.add("expand");
    e.currentTarget.remove();
  };
  const onlyTouch = (ev) => {
    // Call preventDefault() to prevent any further handling
    console.log("Here a touchstart event is triggered");
    ev.preventDefault();
  };
  const handleSubmit = (prop, rdate) => {
    setCustomerror(formRef.current.errors);
    setTimeout(() => {
      if (formRef.current.errors !== {}) {
        let element = document.getElementById("input-error1");
        if (element !== null) {
          element.focus();
        }
      }
    }, 1000);

    console.log(error);
    if (prop === "PDF") {
      setPdfGenerate(true);
      setsaveForm(false);
      setDocGenerate(false);
    } else if (prop === "SAVE") {
      setPdfGenerate(false);
      setsaveForm(true);
      setDocGenerate(false);
    } else if (prop === "DOC") {
      setsaveForm(false);
      setPdfGenerate(false);
      setDocGenerate(true);
    }
    if (formRef.current) {
      formRef.current.handleSubmit(prop);
      // formRef.current.handleReset();
    }
  };

  useEffect(() => {
    console.log(formRef.current);
    let newObj = {};
    if (answerData.length > 0) {
      answerData.forEach((item) => {
        item.questions.forEach((que) => {
          if (que.answer) {
            newObj["text_" + que.question_id] = que.answer;
          }
          if (que.explantionAnswer) {
            newObj["explantion_" + que.question_id] = que.explantionAnswer;
          }
          if (que.values) {
            let checBoxval = [];
            que.values.forEach((value) => {
              if (que.type === "RadioButtons") {
                newObj["answer_" + que.question_id] = value.value_id.toString();
              } else if (que.type === "Checkboxes") {
                checBoxval.push(value.value_id.toString());
                newObj["answer_" + que.question_id] = checBoxval;
              }
              if (value.subanswer) {
                newObj[
                  "subanswer_" +
                    que.question_id +
                    "_" +
                    value.value_id.toString()
                ] = value.subanswer;
              }
            });
          }
        });
      });
      setansObj(newObj);
    } else {
      setansObj(newObj);
    }
  }, [answerData]);

  return (
    <>
      <div className="body-content ">
        {!pending ? (
          <div className="fml-main">
            <div className="fml-content">
              <div className="fml-heading">
                <h3 className="mb-2">
                  {fmlVariableTitle}
                  <Helmet>
                    <title>
                      {" "}
                      {formData.questinnaireType_description != "" &&
                      formData.questinnaireType_description.split("</p>")
                        .length != 0
                        ? formData.questinnaireType_description
                            .split("</p>")[0]
                            .replace(/(<([^>]+)>)/gi, "")
                            .replaceAll(/&nbsp;/gi, "")
                        : ""}
                    </title>
                  </Helmet>
                </h3>
                <p>
                  {formData.questinnaireType_description != "" &&
                  formData.questinnaireType_description.split("</p>").length > 1
                    ? formData.questinnaireType_description
                        .split("</p>")[1]
                        .replace(/(<([^>]+)>)/gi, "")
                        .replaceAll(/&nbsp;/gi, "")
                    : ""}
                </p>
              </div>
              {/* {
              <div
                dangerouslySetInnerHTML={{
                  __html: formData.questinnaireType_description,
                }}
              />
            } */}
              {!pendingAnswer ? (
                <Formik
                  enableReinitialize
                  initialValues={ansObj}
                  innerRef={formRef}
                  validate={(values) => {
                    const errors = {};
                    // if (questionnaireProp.includes("FML_SAVABLE")) {
                    //   if (!values["text_" + fileNoID]) {
                    //     errors["text_" + fileNoID] = locale.File_no_is_required;
                    //   }

                    //   setCustomerror({ ...errors });
                    //   return errors;
                    // }
                    console.log(formData.data);

                    formData.data.forEach((element, i) => {
                      element.questions.forEach((item) => {
                        item.questionAttr.forEach((queAttr) => {
                          if (
                            queAttr.key === "required" &&
                            queAttr.value === "1"
                          ) {
                            if (!values["text_" + item.question_id]) {
                              errors["text_" + item.question_id] =
                                "This field is required!";
                            }
                          }
                        });
                        if (
                          item.type === "RadioButtons" ||
                          item.type === "Checkboxes"
                        ) {
                          // if (!values["answer_" + item.question_id]) {
                          //   errors["answer_" + item.question_id] =
                          //     "This field is required!";
                          // }
                          item.values.forEach((opt) => {
                            if (
                              opt.subanswerRequired ||
                              ((opt.subanswerRequired === true ||
                                opt.subanswerRequired === "1") &&
                                values["answer_" + item.question_id] &&
                                opt.subanswer)
                            ) {
                              if (
                                item.type === "Checkboxes" &&
                                values["answer_" + item.question_id]
                              ) {
                                if (
                                  values["answer_" + item.question_id].length >
                                  0
                                ) {
                                  values["answer_" + item.question_id].forEach(
                                    (value) => {
                                      if (value === opt.value_id.toString()) {
                                        if (
                                          !values[
                                            "subanswer_" +
                                              item.question_id +
                                              "_" +
                                              value
                                          ]
                                        ) {
                                          errors[
                                            "subanswer_" +
                                              item.question_id +
                                              "_" +
                                              value
                                          ] = "This field is required!";
                                        }
                                      }
                                    }
                                  );
                                }
                              } else if (
                                item.type === "RadioButtons" &&
                                values["answer_" + item.question_id]
                              ) {
                                if (
                                  values["answer_" + item.question_id] ===
                                  opt.value_id.toString()
                                ) {
                                  if (
                                    !values[
                                      "subanswer_" +
                                        item.question_id +
                                        "_" +
                                        values["answer_" + item.question_id]
                                    ]
                                  ) {
                                    errors[
                                      "subanswer_" +
                                        item.question_id +
                                        "_" +
                                        values["answer_" + item.question_id]
                                    ] = "This field is required!";
                                  }
                                }
                              }
                            }
                          });
                        }
                      });
                    });
                    setCustomerror({ ...errors });
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(false);

                    let qid = [];

                    for (const key in values) {
                      let question_id = "";
                      if (key.split("_")[1]) {
                        question_id = key.split("_")[1];
                        if (!qid.includes(question_id)) {
                          qid.push(question_id);
                        }
                      }
                    }

                    let answers = [];

                    qid.forEach((qid) => {
                      let ansObj = {};
                      let newSubanswer = [];
                      for (const key in values) {
                        if (key.split("_")[1] === qid) {
                          ansObj["question_id"] = qid;
                          if (key.split("_")[0] === "answer") {
                            if (!Array.isArray(values[key])) {
                              ansObj["value"] = [values[key]];
                            } else {
                              ansObj["value"] = values[key];
                            }
                          }

                          if (key.split("_")[0] === "explantion") {
                            ansObj["explantion"] = values[key];
                          }
                          if (key.split("_")[0] === "text") {
                            ansObj["answer"] = values[key];
                          }
                          if (key.split("_")[0] === "textarea") {
                            ansObj["answer"] = values[key];
                          }
                          if (key.split("_")[0] === "subanswer") {
                            newSubanswer.push({
                              key: key.split("_")[2],
                              value: values[key],
                            });
                            ansObj["subanswer"] = newSubanswer;
                          }
                        }
                      }

                      answers.push(ansObj);
                    });
                    if (answers.length > 0) {
                      if (generatePdf) {
                        dispatch(
                          generatePDF(
                            {
                              questionnaire_type: id,
                              user_id: props.auth.userdata.id,
                              data: JSON.stringify(answers),
                            },
                            selectedCustomer,
                            "PDF",
                            locale
                          )
                        );
                      } else if (saveForm) {
                        dispatch(
                          saveAnswer(
                            {
                              questionnaire_type: id,
                              user_id: props.auth.userdata.id,
                              data: JSON.stringify(answers),
                              end_date: rDate,
                            },
                            locale
                          )
                        );
                      } else if (generateDoc) {
                        dispatch(
                          generatePDF(
                            {
                              questionnaire_type: id,
                              user_id: props.auth.userdata.id,
                              data: JSON.stringify(answers),
                            },
                            selectedCustomer,
                            "DOC",
                            locale
                          )
                        );
                      }
                    } else {
                      dispatch({
                        type: actionTypes.ERROR_MESSAGE,
                        payload: locale.Please_fill_the_form_first,
                      });
                    }
                    if (Object.keys(ansObj).length < 2) {
                      resetForm({ values: "" });
                    }

                    setRdate("");
                  }}
                >
                  {({ values, isSubmitting, dirty, handleReset, touched }) => (
                    <div className="fml-body">
                      <Form action="" id="newcustomer">
                        <div className="">
                          {formData.data.map((element, i) => (
                            <div key={i} className="section_break">
                              {/* {element.cat
                              .replace(/(<([^>]+)>)/gi, "")
                              .replaceAll(/(\r\n|\n|\r)/gm, "") !==
                            "Uncategorized"
                              ? countCat++
                              : ""} */}
                              <a
                                id={
                                  element.cat
                                    .replace(/(<([^>]+)>)/gi, "")
                                    .replaceAll(/(\r\n|\n|\r)/gm, "") !==
                                  "Uncategorized"
                                    ? "rubriek" + countCat++
                                    : ""
                                }
                              ></a>
                              <div className="fml-list">
                                {questionnaireProp.includes("UNCAT_VISIBLE") ? (
                                  <h3>
                                    <a
                                      dangerouslySetInnerHTML={{
                                        __html: element.cat,
                                      }}
                                    ></a>
                                    {/* <img src="/assets/images/icon-link.svg" /> */}
                                  </h3>
                                ) : element.cat
                                    .replace(/(<([^>]+)>)/gi, "")
                                    .replaceAll(/(\r\n|\n|\r)/gm, "") !==
                                  "Uncategorized" ? (
                                  <h3>
                                    <a
                                      dangerouslySetInnerHTML={{
                                        __html: element.cat,
                                      }}
                                    ></a>
                                    {/* <img src="/assets/images/icon-link.svg" /> */}
                                  </h3>
                                ) : (
                                  ""
                                )}

                                <div className="row">
                                  {element.questions.map((que, j) => (
                                    <div
                                      key={i + "questions" + j}
                                      className={
                                        element.cat
                                          .replace(/(<([^>]+)>)/gi, "")
                                          .replaceAll(/(\r\n|\n|\r)/gm, "") ===
                                        "Uncategorized"
                                          ? "col-sm-4"
                                          : "col-12"
                                      }
                                    >
                                      {element.cat
                                        .replace(/(<([^>]+)>)/gi, "")
                                        .replaceAll(/(\r\n|\n|\r)/gm, "") !==
                                      "Uncategorized" ? (
                                        <h4>
                                          {/* {que.order + 1 + ". "} */}
                                          {que.questionName
                                            .replaceAll(/(<([^>]+)>)/gi, "")
                                            .replace(/&nbsp;/gi, "")}
                                        </h4>
                                      ) : (
                                        ""
                                      )}

                                      {/* <div
                                        className="custom-alert"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            que.questionDescription != null
                                              ? que.questionDescription.replaceAll(
                                                  "<p></p>",
                                                  ""
                                                )
                                              : "",
                                        }}
                                      /> */}
                                      <div
                                        className="custom-alert"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            que.questionDescription != null
                                              ? que.questionDescription.replaceAll(
                                                  "<p></p>",
                                                  ""
                                                )
                                              : "",
                                        }}
                                      />

                                      {que.type === "RadioButtons" ||
                                      que.type === "Checkboxes" ? (
                                        que.values.map((options, k) => (
                                          <div
                                            className="option-list"
                                            key={j + "_" + k}
                                          >
                                            <Field
                                              type={
                                                que.type === "Checkboxes"
                                                  ? "checkbox"
                                                  : "radio"
                                              }
                                              name={"answer_" + que.question_id}
                                              placeholder=""
                                              className="form-control"
                                              id={i + "_" + j + "_" + k}
                                              value={options.value_id.toString()}
                                              onClick={(e) =>
                                                checkifchecked(e, values)
                                              }
                                            />
                                            <label
                                              className=""
                                              htmlFor={i + "_" + j + "_" + k}
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  options.order +
                                                  " " +
                                                  options.text,
                                              }}
                                            />

                                            <label>
                                              {" "}
                                              {options.subanswer ? (
                                                <Field
                                                  type="text"
                                                  name={
                                                    "subanswer_" +
                                                    que.question_id +
                                                    "_" +
                                                    options.value_id
                                                  }
                                                  id={
                                                    error[
                                                      "subanswer_" +
                                                        que.question_id +
                                                        "_" +
                                                        options.value_id
                                                    ]
                                                      ? "input-error1"
                                                      : ""
                                                  }
                                                  placeholder=""
                                                  className={`form-control ${
                                                    error[
                                                      "subanswer_" +
                                                        que.question_id +
                                                        "_" +
                                                        options.value_id
                                                    ]
                                                      ? "input-error"
                                                      : ""
                                                  }`}
                                                  value={
                                                    values[
                                                      "subanswer_" +
                                                        que.question_id +
                                                        "_" +
                                                        options.value_id
                                                    ]
                                                      ? values[
                                                          "subanswer_" +
                                                            que.question_id +
                                                            "_" +
                                                            options.value_id
                                                        ]
                                                      : ""
                                                  }
                                                />
                                              ) : (
                                                ""
                                              )}
                                            </label>
                                          </div>
                                        ))
                                      ) : que.type === "TextArea" ? (
                                        <>
                                          {/* <label
                                            dangerouslySetInnerHTML={{
                                              __html: que.questionName,
                                            }}
                                          /> */}
                                          <Field
                                            as="textarea"
                                            name={"textarea_" + que.question_id}
                                            placeholder=""
                                            className="form-control"
                                            value={
                                              values[
                                                "textarea_" + que.question_id
                                              ]
                                                ? values[
                                                    "textarea_" +
                                                      que.question_id
                                                  ]
                                                : ""
                                            }
                                          />
                                        </>
                                      ) : que.type === "TextInput" ? (
                                        <>
                                          <div className="form-group mb-4">
                                            {element.cat
                                              .replace(/(<([^>]+)>)/gi, "")
                                              .replaceAll(
                                                /(\r\n|\n|\r)/gm,
                                                ""
                                              ) === "Uncategorized" ? (
                                              <label htmlFor="">
                                                {que.questionName
                                                  .replaceAll(
                                                    /(<([^>]+)>)/gi,
                                                    ""
                                                  )
                                                  .replace(/&nbsp;/gi, "")}
                                              </label>
                                            ) : (
                                              ""
                                            )}

                                            <Field
                                              type="text"
                                              name={"text_" + que.question_id}
                                              placeholder=""
                                              id={
                                                error["text_" + que.question_id]
                                                  ? "input-error1"
                                                  : ""
                                              }
                                              className={`form-control ${
                                                touched[
                                                  "text_" + que.question_id
                                                ] &&
                                                error["text_" + que.question_id]
                                                  ? "input-error"
                                                  : ""
                                              }`}
                                              value={
                                                values[
                                                  "text_" + que.question_id
                                                ]
                                                  ? values[
                                                      "text_" + que.question_id
                                                    ]
                                                  : ""
                                              }
                                            />

                                            {/* <ErrorMessage
                                              className="error"
                                              name={"text_" + que.question_id}
                                              component="span"
                                            /> */}

                                            {touched[
                                              "text_" + que.question_id
                                            ] &&
                                            error["text_" + que.question_id] ? (
                                              <>
                                                <span className="error">
                                                  {fileNoID === que.question_id
                                                    ? locale.File_no_is_required
                                                    : que.questionName
                                                        .replaceAll(
                                                          /(<([^>]+)>)/gi,
                                                          ""
                                                        )
                                                        .replace(
                                                          /&nbsp;/gi,
                                                          ""
                                                        ) +
                                                      " " +
                                                      locale.Is_required}
                                                </span>
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </>
                                      ) : que.type === "NumberInput" ? (
                                        <>
                                          <div className="form-group mb-4">
                                            {element.cat
                                              .replace(/(<([^>]+)>)/gi, "")
                                              .replaceAll(
                                                /(\r\n|\n|\r)/gm,
                                                ""
                                              ) === "Uncategorized" ? (
                                              <label htmlFor="">
                                                {que.questionName
                                                  .replaceAll(
                                                    /(<([^>]+)>)/gi,
                                                    ""
                                                  )
                                                  .replace(/&nbsp;/gi, "")}
                                              </label>
                                            ) : (
                                              ""
                                            )}
                                            <Field
                                              type="number"
                                              name={"text_" + que.question_id}
                                              id={
                                                error["text_" + que.question_id]
                                                  ? "input-error1"
                                                  : ""
                                              }
                                              placeholder=""
                                              className={`form-control ${
                                                touched[
                                                  "text_" + que.question_id
                                                ] &&
                                                error["text_" + que.question_id]
                                                  ? "input-error"
                                                  : ""
                                              }`}
                                              value={
                                                values[
                                                  "text_" + que.question_id
                                                ]
                                                  ? values[
                                                      "text_" + que.question_id
                                                    ]
                                                  : ""
                                              }
                                            />

                                            {touched[
                                              "text_" + que.question_id
                                            ] &&
                                            error["text_" + que.question_id] ? (
                                              <>
                                                <span className="error">
                                                  {fileNoID === que.question_id
                                                    ? locale.File_no_is_required
                                                    : que.questionName
                                                        .replaceAll(
                                                          /(<([^>]+)>)/gi,
                                                          ""
                                                        )
                                                        .replace(
                                                          /&nbsp;/gi,
                                                          ""
                                                        ) +
                                                      " " +
                                                      locale.Is_required}
                                                </span>
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </>
                                      ) : que.type === "DatePicker" ? (
                                        <>
                                          {que.questionAttr.forEach((attr) => {
                                            if (
                                              attr.key === "defaultToday" &&
                                              attr.value === "1"
                                            ) {
                                              values[
                                                "text_" + que.question_id
                                              ] = values[
                                                "text_" + que.question_id
                                              ]
                                                ? values[
                                                    "text_" + que.question_id
                                                  ]
                                                : defaultToday;
                                            }
                                          })}
                                          <div className="form-group mb-4">
                                            {element.cat
                                              .replace(/(<([^>]+)>)/gi, "")
                                              .replaceAll(
                                                /(\r\n|\n|\r)/gm,
                                                ""
                                              ) === "Uncategorized" ? (
                                              <label htmlFor="">
                                                {que.questionName
                                                  .replaceAll(
                                                    /(<([^>]+)>)/gi,
                                                    ""
                                                  )
                                                  .replace(/&nbsp;/gi, "")}
                                              </label>
                                            ) : (
                                              ""
                                            )}

                                            <Field
                                              type="date"
                                              name={"text_" + que.question_id}
                                              placeholder=""
                                              className="form-control"
                                              value={
                                                values[
                                                  "text_" + que.question_id
                                                ]
                                                  ? values[
                                                      "text_" + que.question_id
                                                    ]
                                                  : ""
                                              }
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      {que.explanation_box ? (
                                        <div className="option-list option-list-custom">
                                          <label htmlFor="">
                                            {que.explanation_description.replace(
                                              /(<([^>]+)>)/gi,
                                              ""
                                            )}
                                          </label>
                                          <Field
                                            as="textarea"
                                            name={
                                              "explantion_" + que.question_id
                                            }
                                            placeholder=""
                                            className="form-control"
                                            value={
                                              values[
                                                "explantion_" + que.question_id
                                              ]
                                                ? values[
                                                    "explantion_" +
                                                      que.question_id
                                                  ]
                                                : ""
                                            }
                                          />
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="section_break">
                          <a id="bottom"></a>
                        </div>

                        <PDFDownloadLink
                          document={
                            <PDFdata
                              data={pdfContent}
                              customerData={selectedCustomer}
                              questionnaireProp={questionnaireProp}
                            />
                          }
                          fileName={(
                            formData.questionnaireType +
                            "-" +
                            date.getDate() +
                            "-" +
                            date.getMonth() +
                            "-" +
                            date.getFullYear()
                          ).replaceAll(" ", "_")}
                        >
                          <button
                            type="button"
                            id="pdf_btn"
                            className="d-none"
                            ref={ref}
                          >
                            Download
                          </button>
                        </PDFDownloadLink>
                      </Form>
                    </div>
                  )}
                </Formik>
              ) : (
                <div className="loader-wrap fml-c-loader">
                  <CustomLoader />
                </div>
              )}
            </div>

            <div className="fml-sidebar" id="sticky">
              <div className="fix-wrapper">
                {questionnaireProp.includes("FML_SAVABLE") &&
                answerListNew.length > 0 ? (
                  <div className="fml-report-wrapper">
                    <h4>{locale.Fml_file_no}</h4>
                    <hr />
                    <ul>
                      {answerListNew.map((item) => (
                        <li key={item.id} className="fml-reports">
                          <a
                            onClick={(e) => {
                              dispatch(
                                getListAnswer({
                                  user_id: item.customer_user_id,
                                  questionnaire_type: id,
                                  answer_id: item.id,
                                })
                              );
                              document
                                .querySelectorAll(".fml-reports")
                                .forEach((item, i) => {
                                  item.classList.remove("active");
                                });

                              e.currentTarget.parentNode.classList.add(
                                "active"
                              );
                            }}
                            className=""
                          >
                            {item.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {answerListNew.length > 6 ? (
                      <a className="expand-list" onClick={(e) => expandList(e)}>
                        <img src="/assets/images/arrow-down.svg" alt="" />
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}

                <div className="button-group fml-btn-wrapper">
                  {questionnaireProp.includes("FML_SAVABLE") ? (
                    <>
                      <button
                        className="btn btn-border"
                        onClick={() => toFML()}
                      >
                        {fmlBtntext}
                      </button>
                    </>
                  ) : (
                    ""
                  )}

                  <button
                    className="btn btn-primary d-none"
                    type="submit"
                    data-bs-toggle="modal"
                    data-bs-target={`#common_save_data`}
                    ref={btnPopup}
                  >
                    Save
                  </button>
                  <div className="inline-btn">
                  <Tippy content={locale.Download_pdf}>
                    <input
                      type="image"
                      src="/assets/images/icon-pdf-file.svg"
                      name="button"
                      onClick={() => handleSubmit("PDF", "")}
                      className="btn btn-border-red"
                    />
                  </Tippy>
                  <Tippy content={locale.Download_doc}>
                    <input
                      type="image"
                      src="/assets/images/icon-doc-file.svg"
                      name="button"
                      onClick={() => handleSubmit("DOC", "")}
                      className="btn btn-border-blue"
                    />
                  </Tippy>
                  </div>
                </div>

                <div className="gettomenus custom-scroll custom-scroll-long">
                  <h4>{locale.Quick_links}</h4>
                  <hr />
                  <ul>
                    <li>
                      <a href="#top" className="active-menu">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13.501"
                          height="20.243"
                          viewBox="0 0 13.501 20.243"
                        >
                          <path
                            d="M24.49,15.216a.919.919,0,0,1-1.294.007l-4.282-4.268V27.218a.914.914,0,0,1-1.828,0V10.955L12.8,15.23a.925.925,0,0,1-1.294-.007.91.91,0,0,1,.007-1.287l5.836-5.794h0a1.026,1.026,0,0,1,.288-.19.872.872,0,0,1,.352-.07.916.916,0,0,1,.64.26l5.836,5.794A.9.9,0,0,1,24.49,15.216Z"
                            transform="translate(-11.247 -7.882)"
                          />
                        </svg>
                        {locale.Top}{" "}
                      </a>
                    </li>
                    {categoryList.map((item, index) =>
                      item.questionnaire_id.toString() === id ? (
                        item.value !== "Uncategorized" ? (
                          <li key={"cat_" + index}>
                            <a href={"#rubriek" + count++}>{item.value}</a>
                          </li>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )
                    )}

                    <li>
                      <a className="end" href="#bottom">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13.501"
                          height="20.243"
                          viewBox="0 0 13.501 20.243"
                        >
                          <path
                            d="M24.49,15.216a.919.919,0,0,1-1.294.007l-4.282-4.268V27.218a.914.914,0,0,1-1.828,0V10.955L12.8,15.23a.925.925,0,0,1-1.294-.007.91.91,0,0,1,.007-1.287l5.836-5.794h0a1.026,1.026,0,0,1,.288-.19.872.872,0,0,1,.352-.07.916.916,0,0,1,.64.26l5.836,5.794A.9.9,0,0,1,24.49,15.216Z"
                            transform="translate(24.748 28.125) rotate(180)"
                          />
                        </svg>
                        {locale.End}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="fml-btn-bottom">
                {questionnaireProp.includes("FML_SAVABLE") ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handlePopup(formRef)}
                      >
                        {locale.Save}
                      </button>
                      <button
                      onClick={()=>setansObj({})}
                        className="btn btn-border"
                      >
                        Reset
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <CommonModal
              id={"save_data"}
              yes={(rDate) => {
                console.log(rDate);

                if (rDate !== "") {
                  setRdate(rDate);
                  handleSubmit("SAVE", rDate);
                } else {
                  dispatch({
                    type: actionTypes.ERROR_MESSAGE,
                    payload: locale.Please_select_the_date,
                  });
                }
              }}
            />
          </div>
        ) : (
          <div className="loader-wrap">
            <CustomLoader />
          </div>
        )}
      </div>
    </>
  );
};
export default QuestionnaireView;
