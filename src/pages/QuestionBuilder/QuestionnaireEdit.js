import React, { Fragment, useEffect, useState } from "react";
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { ReactFormBuilder, Registry } from "react-form-builder2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  displaySubanswerBelowOptions,
  getQuestionsbyid,
  updateQuestions,
} from "../../actions/questioerAction";
import EditCustomizations from "../../common/EditCustomization";
import FormElementsEdit from "../../formbuilder2/form-elements-edit";
import CustomLoader from "../Customloader";
import ButtonLoader from "../Customloader/ButtonLoader";
import HeaderContainer from "../Header/HeaderContainer";

export const MyInput = React.forwardRef((props, ref) => {
  const { name, defaultValue, disabled } = props;
  return (
    <textarea
      ref={ref}
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
});
// Registry.register("MyInput", MyInput);
const QuestionnaireEdit = (props) => {
  const locale = props.locale;
  const nav = useNavigate();
  const [buttonPending, setButtonPending] = useState(false);
  const params = useParams();
  const id = params.id;
  console.log(id);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getQuestionsbyid(id));
  }, [id]);
  // const questionData = localStorage.getItem("questionsData");
  // const formData = JSON.parse(questionData);
  const questionAttrData = useSelector(
    (state) => state.viewQuestionnaireReducer
  ).questionnaireAttr;
  let attrData = {};
  useEffect(() => {
    if (Object.keys(questionAttrData).length !== 0) {
      questionAttrData.forEach((item) => {
        if (item.value == "1" || item.value === true) {
          attrData[item.key] = true;
        } else if (item.value !== "0" || item.value === false) {
          attrData[item.key] = item.value;
        }
      });
      setAttributesData(attrData);
    }
    console.log(attrData);
  }, [questionAttrData]);

  const data = useSelector((state) => state.viewQuestionnaireReducer).itemsData;

  const pending = useSelector(
    (state) => state.viewQuestionnaireReducer
  ).pending;
  const [attributesData, setAttributesData] = useState(attrData);
  const [fromContent, setFromContent] = useState({ task_data: data });
  const messageType = useSelector((state) => state.toasterReducer);

  useEffect(() => {
    if (messageType.type === "error") {
      setButtonPending(false);
    }
  }, [messageType]);

  const onPost = (data) => {
    console.log("Post Data", data);
    let fromDataArr = data.task_data;
    dispatch(displaySubanswerBelowOptions(fromDataArr));
    setFromContent(data);
  };
  const items = [
    // Additional standard components, you don't need full definition if no modification is required.
    {
      key: "Header",
    },
    {
      key: "Paragraph",
    },
    {
      key: "TextInput",
    },
    {
      key: "MyInput",
      element: "CustomElement",
      component: MyInput,
      type: "custom",
      forwardRef: true,
      field_name: "my_input_",
      name: "Explanation box",
      icon: "fa fa-cog",
      props: { test: "test_input" },
      label: "Explanation Box",
    },
    {
      key: "TextArea",
    },
    {
      key: "RadioButtons",
      canHaveAnswer: true,
      name: "Radio options",
      icon: "far fa-dot-circle",
      label: "Placeholder Label...",
      field_name: "radiobuttons_",
      options: [],
    },
    {
      key: "Checkboxes",
    },
    {
      key: "NumberInput",
    },
    {
      key: "DatePicker",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      let fromDataArr = fromContent.task_data;
      dispatch(displaySubanswerBelowOptions(fromDataArr));
    }, 3000);
  }, [fromContent]);

  const onLoad = () => {
    console.log("data loaded");

    const elem = document.querySelector(".react-form-builder-toolbar ul");
    elem.insertAdjacentHTML("afterend", `<div class="right-attribute"></div>`);
    const element = React.createElement(
      "div",
      { className: "test" },
      React.createElement(
        "button",
        {
          className: "btn btn-primary w-100",
          "data-bs-toggle": "modal",
          "data-bs-target": "#editcustomizations",
        },
        locale.Customizations
      )
      // React.createElement(
      //   "form",
      //   { id: "attr_form" },
      //   React.createElement(
      //     "div",
      //     { className: "row" },
      //     React.createElement(
      //       "div",
      //       { className: "col-md-6" },
      //       React.createElement(
      //         "div",
      //         { className: "form-group mb-4" },
      //         React.createElement("label", null, "Key"),
      //         React.createElement(
      //           "input",
      //           {
      //             type: "text",
      //             name: "key",
      //             id: "attr_key",
      //             defaultValue: questionData !== null ? questionData.key : "",
      //             className: "form-control",
      //           },
      //           null
      //         )
      //       )
      //     ),
      //     React.createElement(
      //       "div",
      //       { className: "col-md-6" },
      //       React.createElement(
      //         "div",
      //         { className: "form-group mb-4" },
      //         React.createElement("label", null, "Value"),
      //         React.createElement(
      //           "input",
      //           {
      //             type: "text",
      //             name: "value",
      //             id: "attr_value",
      //             defaultValue: questionData !== null ? questionData.value : "",
      //             className: "form-control",
      //           },
      //           null
      //         )
      //       )
      //     ),
      //     React.createElement(
      //       "div",
      //       { className: "col-md-12" },
      //       React.createElement(
      //         "div",
      //         { className: "form-group mb-4" },
      //         React.createElement("label", null, "Description"),
      //         React.createElement(
      //           "textarea",
      //           {
      //             name: "description",
      //             id: "attr_description",
      //             defaultValue:
      //               questionData !== null ? questionData.description : "",
      //             className: "form-control",
      //           },
      //           null
      //         )
      //       )
      //     )
      //   )
      // )
    );
    const rightAttribute = document.querySelector(
      ".react-form-builder-toolbar .right-attribute"
    );
     
    const root = createRoot(rightAttribute);

    root.render(element);
    setFromContent({ task_data: data });
    console.log(" Load From Data");
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  const onSubmitData = () => {
    setButtonPending(true);
    console.log(fromContent);

    let mainQuestionnaireType = "";
    let mainQuestionnaireDescription = "";
    let questinnaireType_id = "";
    let cat = "";
    let cat_id = "";
    let demoArray = [];
    let childIds = [];
    fromContent.task_data.forEach((item, index) => {
      // console.log(item.element);
      if (index === 0 && item.element === "Header") {
        mainQuestionnaireType = item.content;
        questinnaireType_id = item.back_id;
      }
      if (index === 1 && item.element === "Paragraph") {
        mainQuestionnaireDescription = item.content;
      }

      if (index != 0 && index != 1 && item.element === "Header") {
        cat = item.content;
        cat_id = item.back_id != undefined ? item.back_id : "";
      }

      if (item.element != "Header" && index != 0 && index != 1) {
        if (
          item.element != "CustomElement" &&
          item.element != "Explanation box"
        ) {
          let attributes = [];
          let attrobj = {};
          if (item.element === "DatePicker") {
            if (item.defaultToday) {
              attrobj.defaultToday = true;
            } else {
              attrobj.defaultToday = false;
            }
          }
          if (item.required) {
            attrobj.required = true;
          } else {
            attrobj.required = false;
          }
          attributes.push(attrobj);
          demoArray.push({
            cat: cat,
            cat_id: cat_id,
            questionName: item.label,
            questionAttr: attributes,
            question_id: item.back_id,
            type: item.element,
            values:
              item.element === "RadioButtons" || item.element === "Checkboxes"
                ? item.options
                : "",
            explanation_box:
              index < fromContent.task_data.length - 1 &&
              fromContent.task_data[index + 1].element === "CustomElement" &&
              fromContent.task_data[index + 1].text === "Explanation box"
                ? true
                : false,
            explanation_description:
              index < fromContent.task_data.length - 1 &&
              fromContent.task_data[index + 1].element === "CustomElement" &&
              fromContent.task_data[index + 1].text === "Explanation box"
                ? fromContent.task_data[index + 1].label
                : "Explanation",
          });
        }
      }
    });

    let catArray = [
      ...new Map(
        demoArray.map((item) => [
          item["cat"],
          { cat: item.cat, cat_id: item.cat_id },
        ])
      ).values(),
    ];
    let finalArray = [];

    catArray.forEach((cat, index) => {
      let questionArray = [];
      demoArray.forEach((data, i) => {
        if (data.cat === cat.cat) {
          questionArray.push({
            questionName: data.questionName,
            question_id: data.question_id,
            questionAttr: data.questionAttr,
            type: data.type,
            values: data.values,
            explanation_box: data.explanation_box,
            explanation_description: data.explanation_description,
          });
        }
      });
      finalArray.push({
        cat: cat.cat,
        cat_id: cat.cat_id,
        questions: questionArray,
      });
    });
    console.log({
      questinnaireType: mainQuestionnaireType,
      questionnaireDescription: mainQuestionnaireDescription,
      questinnaireType_id: questinnaireType_id,
      data: finalArray,
    });
    console.log(attributesData);
    dispatch(
      updateQuestions(
        {
          questionnaireType: mainQuestionnaireType.replace(/(<([^>]+)>)/gi, ""),
          questionnaireDescription: mainQuestionnaireDescription,
          questinnaireType_id: id,
          data: JSON.stringify(finalArray),
          questionnaireAttributes: JSON.stringify(attributesData),
        },
        nav,
        locale
      )
    );
  };

  return (
    <Fragment>
      <div className="form-builder-wrap">
        <div className="body-content">
          {!pending ? (
            <>
              <div className="btn-wrap">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={onSubmitData}
                >
                  {buttonPending ? <ButtonLoader /> : locale.Update}
                </button>
              </div>

              <ReactFormBuilder
                onLoad={onLoad}
                onPost={onPost}
                onSubmit={onSubmitData}
                renderEditForm={(props) => <FormElementsEdit {...props} />}
                toolbarItems={items}
              />
              <EditCustomizations
                id={"editcustomizations"}
                attributesData={questionAttrData}
                yes={(attributesData) => {
                  setAttributesData(attributesData);
                }}
                locale={locale}
              />
            </>
          ) : (
            <div className="loader-wrap">
              <CustomLoader />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default QuestionnaireEdit;
