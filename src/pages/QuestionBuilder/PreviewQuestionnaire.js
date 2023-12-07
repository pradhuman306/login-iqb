import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionsbyid } from "../../actions/questioerAction";
import CustomLoader from "../Customloader";
import { checkEmptyObjectOrarray } from "../../actions/commonActions";
const PreviewQuestionnaire = (props) => {
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
  const formData = useSelector(
    (state) => state.viewQuestionnaireReducer
  ).questionnaireData;
  const pending = useSelector(
    (state) => state.viewQuestionnaireReducer
  ).pending;
  console.log(pending);
  let cat = "";
  const dispatch = useDispatch();
  useEffect(() => {
    if (props.id !== "") {
      dispatch(getQuestionsbyid(props.id));
    }
  }, [props.id]);
  let questionnaireProp = [];
  if (checkEmptyObjectOrarray(formData)) {
    if (formData.questionnaireAttributes !== null) {
      formData.questionnaireAttributes.forEach((item) => {
        if (item.value === "1") {
          questionnaireProp.push(item.key);
        }
      });
    }
  }
  return (
    <div
      className="modal fade"
      id="viewquestionnaire"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog model-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="badge">
              {!pending ? formData.questionnaireType : "Preview"}
            </h4>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="/assets/images/icon-close.svg" alt="" />
            </button>
          </div>
          <div className="modal-body">
            <div className="">
              {!pending ? (
                <div className="fml-main">
                  <div className="preview-content">
                    <Formik
                      initialValues={{}}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        setSubmitting(false);
                      }}
                    >
                      {({
                        values,
                        isSubmitting,
                        dirty,
                        handleReset,
                        touched,
                      }) => (
                        <div className="fml-body">
                          <Form action="" id="newcustomer">
                            <div className="">
                              <div className="section_break">
                                <div className="fml-list">
                                  <h3 className="mb-2">
                                    {console.log(
                                      formData.questinnaireType_description.split(
                                        "</p>"
                                      )
                                    )}
                                    {formData.questinnaireType_description !=
                                      "" &&
                                    formData.questinnaireType_description.split(
                                      "</p>"
                                    ).length != 0
                                      ? formData.questinnaireType_description
                                          .split("</p>")[0]
                                          .replace(/(<([^>]+)>)/gi, "")
                                          .replaceAll(/&nbsp;/gi, "")
                                      : ""}
                                  </h3>
                                  <p>
                                    {formData.questinnaireType_description !=
                                      "" &&
                                    formData.questinnaireType_description.split(
                                      "</p>"
                                    ).length > 1
                                      ? formData.questinnaireType_description
                                          .split("</p>")[1]
                                          .replace(/(<([^>]+)>)/gi, "")
                                          .replaceAll(/&nbsp;/gi, "")
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              {formData.data.map((element, i) => (
                                <div key={i} className="section_break">
                                  <a id={"rubriek" + (i + 1)}></a>
                                  <div className="fml-list">
                                    {questionnaireProp.includes(
                                      "UNCAT_VISIBLE"
                                    ) ? (
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
                                              .replaceAll(
                                                /(\r\n|\n|\r)/gm,
                                                ""
                                              ) === "Uncategorized"
                                              ? "col-sm-4"
                                              : "col-12"
                                          }
                                        >
                                          {element.cat
                                            .replace(/(<([^>]+)>)/gi, "")
                                            .replaceAll(
                                              /(\r\n|\n|\r)/gm,
                                              ""
                                            ) !== "Uncategorized" ? (
                                            <h4>
                                              {/* {j + 1 + ". "} */}
                                              {que.questionName
                                                .replaceAll(/(<([^>]+)>)/gi, "")
                                                .replace(/&nbsp;/gi, "")}
                                            </h4>
                                          ) : (
                                            ""
                                          )}

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
                                                  name={"ans" + i + "_" + j}
                                                  placeholder=""
                                                  className="form-control"
                                                  id={i + "_" + j + "_" + k}
                                                  value={options.value}
                                                />
                                                <label
                                                  className=""
                                                  htmlFor={
                                                    i + "_" + j + "_" + k
                                                  }
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      options.order +
                                                      " " +
                                                      options.text,
                                                  }}
                                                />
                                                <label>
                                                  {options.subanswer ? (
                                                    <Field
                                                      type="text"
                                                      name={
                                                        "sub_answer_" +
                                                        i +
                                                        "_" +
                                                        j +
                                                        "_" +
                                                        k
                                                      }
                                                      placeholder=""
                                                      className="form-control"
                                                      value=""
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
                                                name={"text_area" + i + "_" + j}
                                                placeholder=""
                                                className="form-control"
                                                value=""
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
                                                  name={
                                                    "text_" + que.question_id
                                                  }
                                                  placeholder=""
                                                  className="form-control"
                                                  value={
                                                    values[
                                                      "text_" + que.question_id
                                                    ]
                                                  }
                                                />
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
                                                  name={
                                                    "number_" + que.question_id
                                                  }
                                                  placeholder=""
                                                  className="form-control"
                                                  value={
                                                    values[
                                                      "number_" +
                                                        que.question_id
                                                    ]
                                                  }
                                                />
                                              </div>
                                            </>
                                          ) : que.type === "DatePicker" ? (
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
                                                {que.questionAttr.forEach(
                                                  (attr) => {
                                                    if (
                                                      attr.key ===
                                                        "defaultToday" &&
                                                      attr.value === "1"
                                                    ) {
                                                      values[
                                                        "date_" +
                                                          que.question_id
                                                      ] = values[
                                                        "date_" +
                                                          que.question_id
                                                      ]
                                                        ? values[
                                                            "date_" +
                                                              que.question_id
                                                          ]
                                                        : defaultToday;
                                                    }
                                                  }
                                                )}
                                                <Field
                                                  type="date"
                                                  name={
                                                    "date_" + que.question_id
                                                  }
                                                  placeholder=""
                                                  className="form-control"
                                                  value={
                                                    values[
                                                      "date_" + que.question_id
                                                    ]
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
                                                  "explantion_" + i + "_" + j
                                                }
                                                placeholder=""
                                                className="form-control"
                                                value=""
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
                          </Form>
                        </div>
                      )}
                    </Formik>
                  </div>
                </div>
              ) : (
                <div className="loader-wrap">
                  <CustomLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PreviewQuestionnaire;
