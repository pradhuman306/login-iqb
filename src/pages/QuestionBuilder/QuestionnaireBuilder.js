import React, { Fragment, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { useState } from "react";
import { ReactFormBuilder, Registry } from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  displaySubanswerBelowOptions,
  submitQuestions,
} from "../../actions/questioerAction";
import FormElementsEdit from "../../formbuilder2/form-elements-edit";
import ButtonLoader from "../Customloader/ButtonLoader";
import HeaderContainer from "../Header/HeaderContainer";
import Customizations from "../../common/Customization";

const MyInput = React.forwardRef((props, ref) => {
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

Registry.register("MyInput", MyInput);
function useForceUpdate() {
  let [value, setState] = useState(true);
  return () => setState(!value);
}

let count = 0;
const QuestionnaireBuilder = (props) => {
  let forceUpdate = useForceUpdate();
  const locale = props.locale;
  const [buttonPending, setButtonPending] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [attributesData, setAttributesData] = useState({
    key: "",
    value: "",
    description: "",
  });
  let data = [
    {
      id: "Main_heading",
      element: "Header",
      text: "Header Text",
      static: true,
      required: false,
      bold: false,
      italic: false,
      content: locale.Questionnaire_name_goes_here,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
    },
    {
      id: "Sub_heading",
      element: "Paragraph",
      text: "Paragraph",
      static: true,
      required: false,
      bold: false,
      italic: false,
      content: "Sub heading goes here",
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
    },
  ];

  const [fromContent, setFromContent] = useState({ task_data: data });
  useEffect(() => {
    setFromContent({ task_data: data });
  }, [locale]);

  const messageType = useSelector((state) => state.toasterReducer);
  useEffect(() => {
    if (messageType.type === "error") {
      setButtonPending(false);
    }
  }, [messageType]);
  const [items, setItems] = useState([
    {
      key: "Header",
    },
    {
      key: "Paragraph",
      name: "Paragraph",
      static: true,
      icon: "fa fa-paragraph",
      content: "Placeholder Text...",
    },
    {
      key: "TextInput",
      name: "TextInput",
      static: true,
      icon: "fas fa-font",
      label: "Placeholder Text...",
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
  ]);
  useEffect(() => {
    console.log("Use effect runs");
  }, [locale]);

  // const handleChange = (e) => {
  //   console.log(e.target.value);
  //   attributesData[e.target.name] = e.target.value;
  //   setAttributesData(attributesData);
  // };

  const onLoad = () => {
    const elem = document.querySelector(".react-form-builder-toolbar ul");
    elem.insertAdjacentHTML("afterend", `<div class="right-attribute"></div>`);

    const rightAttribute = document.querySelector(
      ".react-form-builder-toolbar .right-attribute"
    );

    const element = React.createElement(
      "div",
      { className: "test" },
      React.createElement(
        "button",
        {
          className: "btn btn-primary w-100",
          "data-bs-toggle": "modal",
          "data-bs-target": "#customizations",
        },
        locale.Customizations
      )

      // React.createElement(
      //   "form",
      //   null,
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
      //             onChange: (e) => handleChange(e),
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
      //             onChange: (e) => handleChange(e),
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
      //             onChange: (e) => handleChange(e),
      //             className: "form-control",
      //           },
      //           null
      //         )
      //       )
      //     )
      //   )
      // )
    );

    const root = createRoot(rightAttribute);

    root.render(element);

    console.log(" Load From Data");
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };
  const onPost = (data) => {
    console.log("Post Data", data);
    let fromDataArr = data.task_data;

    dispatch(displaySubanswerBelowOptions(fromDataArr));
    setFromContent(data);
  };

  const handleUpdate = (data) => {
    console.log("test123" + data);
    onLoad();
  };

  const onSubmitData = () => {
    setButtonPending(true);
    console.log(fromContent);

    let mainQuestionnaireType = "";
    let mainQuestionnaireDescription = "";
    let cat = "Uncategorized";
    let demoArray = [];
    let childIds = [];
    fromContent.task_data.forEach((item, index) => {
      // console.log(item.element);
      if (index === 0 && item.element === "Header") {
        mainQuestionnaireType = item.content;
      }
      if (index === 1 && item.element === "Paragraph") {
        mainQuestionnaireDescription = item.content;
      }

      if (index != 0 && index != 1 && item.element === "Header") {
        cat = item.content;
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
          if (
            item.element === "TwoColumnRow" ||
            item.element === "ThreeColumnRow" ||
            item.element === "FourColumnRow"
          ) {
            item.childItems.forEach((id) => {
              fromContent.task_data.forEach((fromData, index1) => {
                if (fromData.id === id) {
                  childIds.push(id);

                  demoArray.push({
                    cat: cat,
                    questionName: fromData.label,
                    type: fromData.element,
                    questionAttr: attributes,
                    values:
                      fromData.element === "RadioButtons" ||
                      fromData.element === "Checkboxes"
                        ? fromData.options
                        : "",
                    explanation_box:
                      index1 < fromContent.task_data.length - 1 &&
                      fromContent.task_data[index1 + 1].element ===
                        "CustomElement" &&
                      fromContent.task_data[index1 + 1].text ===
                        "Explanation box"
                        ? true
                        : false,
                    explanation_description:
                      index1 < fromContent.task_data.length - 1 &&
                      fromContent.task_data[index1 + 1].element ===
                        "CustomElement" &&
                      fromContent.task_data[index1 + 1].text ===
                        "Explanation box"
                        ? fromContent.task_data[index1 + 1].label
                        : "Explanation",
                  });
                }
              });
            });
          } else if (
            !childIds.includes(item.id) &&
            item.element !== "TwoColumnRow" &&
            item.element !== "ThreeColumnRow" &&
            item.element !== "FourColumnRow"
          ) {
            console.log(item);
            console.log(fromContent);
            demoArray.push({
              cat: cat,
              questionName: item.label,
              type: item.element,
              questionAttr: attributes,
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
          console.log(childIds);
        }
      }
    });

    // console.log(demoArray);
    let catArray = [];
    demoArray.forEach((item, index) => {
      if (!catArray.includes(item.cat)) {
        catArray.push(item.cat);
      }
    });
    // console.log(catArray);
    let finalArray = [];

    catArray.forEach((cat, index) => {
      let questionArray = [];
      demoArray.forEach((data, i) => {
        if (data.cat === cat) {
          questionArray.push({
            questionName: data.questionName,
            type: data.type,
            values: data.values,
            questionAttr: data.questionAttr,
            explanation_box: data.explanation_box,
            explanation_description: data.explanation_description,
          });
        }
      });
      finalArray.push({ cat: cat, questions: questionArray });
    });
    console.log({
      questinnaireType: mainQuestionnaireType,
      questionnaireDescription: mainQuestionnaireDescription,
      data: finalArray,
    });
    console.log(attributesData);
    dispatch(
      submitQuestions(
        {
          questionnaireType: mainQuestionnaireType.replace(/(<([^>]+)>)/gi, ""),
          questionnaireDescription: mainQuestionnaireDescription,
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
          <div className="btn-wrap">
            <button
              className="btn btn-primary"
              type="button"
              onClick={onSubmitData}
            >
              {buttonPending ? <ButtonLoader /> : locale.Submit}
            </button>
          </div>

          <ReactFormBuilder
            edit
            onLoad={onLoad}
            onPost={onPost}
            onChange={handleUpdate}
            onSubmit={onSubmitData}
            renderEditForm={(props) => <FormElementsEdit {...props} />}
            toolbarItems={items}
          />

          <Customizations
            id={"customizations"}
            yes={(attributesData) => {
              console.log(attributesData);
              setAttributesData(attributesData);
            }}
            locale={locale}
          />

          {/* <PrintButton
              id={"react-form-builder-preview pull-left"}
              label={"Print From"}
            /> */}
        </div>
      </div>
    </Fragment>
  );
};

export default QuestionnaireBuilder;
