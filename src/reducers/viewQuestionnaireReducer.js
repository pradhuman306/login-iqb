import {
  VIEW_QUESTIONNAIRE,
  SET_QUESTIONNAIRE_PENDING,
} from "../constants/actionTypes";

const initialState = {
  questionnaireData: [],
  itemsData: [],
  questionnaireAttr: {},
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VIEW_QUESTIONNAIRE:
      let data = [];
      let formData = action.payload;
      if (formData.length != 0) {
        data.push(
          {
            id: "1",
            back_id: formData.questinnaireType_id,
            element: "Header",
            text: "Header Text",
            static: true,
            required: false,
            bold: false,
            italic: false,
            content: formData.questionnaireType,
            canHavePageBreakBefore: true,
            canHaveAlternateForm: true,
            canHaveDisplayHorizontal: true,
            canHaveOptionCorrect: true,
            canHaveOptionValue: true,
            canPopulateFromApi: true,
            dirty: false,
          },
          {
            id: "2",
            back_id: formData.questinnaireType_id,
            element: "Paragraph",
            text: "Paragraph",
            static: true,
            required: false,
            bold: false,
            italic: false,
            content: formData.questinnaireType_description,
            canHavePageBreakBefore: true,
            canHaveAlternateForm: true,
            canHaveDisplayHorizontal: true,
            canHaveOptionCorrect: true,
            canHaveOptionValue: true,
            canPopulateFromApi: true,
          }
        );
        formData.data.forEach((item, i) => {
          data.push({
            id: "cat_" + i,
            back_id: item.cat_id,
            element: "Header",
            text: "Header Text",
            static: true,
            required: false,
            bold: false,
            italic: false,
            content: item.cat,
            canHavePageBreakBefore: true,
            canHaveAlternateForm: true,
            canHaveDisplayHorizontal: true,
            canHaveOptionCorrect: true,
            canHaveOptionValue: true,
            canPopulateFromApi: true,
            dirty: false,
          });

          item.questions.forEach((que, j) => {
            let options1 = [];
            let required = false;
            let defaultToday = false;
            let queDescriptions =
              que.questionDescription !== null ? que.questionDescription : "";

            if (que.type === "RadioButtons" || que.type === "Checkboxes") {
              que.values.forEach((opt, k) => {
                let subanswer = opt.subanswer;
                let subanswerRequired = opt.subanswerRequired;
                let optionObj = {
                  value: opt.value,
                  text: opt.text,
                  key: i + "_" + j + "_" + k,
                  value_id: opt.value_id,
                };
                if (subanswer != undefined) {
                  optionObj.subanswer = subanswer;
                }

                if (
                  subanswerRequired != undefined &&
                  (subanswerRequired === true || subanswerRequired == "1")
                ) {
                  optionObj.subanswerRequired = true;
                }
                if (opt.correct != undefined) {
                  optionObj.correct = opt.correct;
                }
                options1.push(optionObj);
              });
            }
            if (que.questionAttr.length > 0) {
              if (que.type === "DatePicker") {
                que.questionAttr.forEach((queAttr) => {
                  if (queAttr.key === "defaultToday" && queAttr.value === "1") {
                    defaultToday = true;
                  }
                });
              }

              que.questionAttr.forEach((queAttr) => {
                if (queAttr.key === "required" && queAttr.value === "1") {
                  required = true;
                }
              });
            }

            let dataObj = {
              id: "que_" + i + j,
              back_id: que.question_id,
              element: que.type,
              text:
                que.type === "RadioButtons"
                  ? "Multiple Choice"
                  : que.type === "Checkboxes"
                  ? "Checkboxes"
                  : que.type === "Textarea"
                  ? "Multi line input"
                  : que.type === "DatePicker"
                  ? "Date"
                  : que.type === "TextInput"
                  ? "TextInput"
                  : que.type === "NumberInput"
                  ? "Number Input"
                  :"",
              required: required,
              dateFormat: que.type === "DatePicker" ? "MM/dd/yyyy" : "",
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              canPopulateFromApi: true,
              field_name: "radiobuttons_06FE5030-DCD4-42C6-A9AC-153226DDB882",
              label: que.questionName + queDescriptions,
              dirty: false,
            };
            if (que.type === "DatePicker") {
              dataObj["defaultToday"] = defaultToday;
            }
            if (que.type === "RadioButtons" || que.type === "Checkboxes") {
              dataObj["options"] = options1;
            }
            data.push(dataObj);
            if (que.explanation_box) {
              data.push({
                id: "exp_" + i + "_" + j,
                element: "CustomElement",
                text: "Explanation box",
                required: false,
                key: "MyInput",
                custom: true,
                forwardRef: true,
                props: {
                  test: "test_input",
                },
                component: {},
                custom_options: [],
                canHavePageBreakBefore: true,
                canHaveAlternateForm: true,
                canHaveDisplayHorizontal: true,
                canHaveOptionCorrect: true,
                canHaveOptionValue: true,
                canPopulateFromApi: true,
                field_name: "my_input_4D746DCC-EE61-4DFC-BA15-C9C5ACECFAE7",
                label: que.explanation_description.replace(/(<([^>]+)>)/gi, ""),
              });
            }
          });
        });
        // console.log(data);
      }
      return {
        ...state,
        questionnaireData: action.payload,
        questionnaireAttr: action.payload.questionnaireAttributes,
        itemsData: data,
        pending: false,
      };

    case SET_QUESTIONNAIRE_PENDING:
      return {
        ...state,
        pending: true,
      };
    default:
      return state;
  }
}
