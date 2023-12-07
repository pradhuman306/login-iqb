/**
  * <DynamicOptionList />
  */

 import React from 'react';
 import ID from './UUID';
 import IntlMessages from './language-provider/IntlMessages';

 export default class DynamicOptionList extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       element: this.props.element,
       data: this.props.data,
       dirty: false,
     };
   }

   _setValue(text) {
     return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
   }

   editOption(option_index, e) {
    console.log('test2');
     const this_element = this.state.element;
     const val = (this_element.options[option_index].value !== this._setValue(this_element.options[option_index].text)) ? this_element.options[option_index].value : this._setValue(e.target.value);

     this_element.options[option_index].text = e.target.value;
     this_element.options[option_index].value = val;
     this.setState({
       element: this_element,
       dirty: true,
     });
   }

   editValue(option_index, e) {
    console.log('test1');
     const this_element = this.state.element;
     const val = (e.target.value === '') ? this._setValue(this_element.options[option_index].text) : e.target.value;
     this_element.options[option_index].value = val;
     this.setState({
       element: this_element,
       dirty: true,
     });
   }

   // eslint-disable-next-line no-unused-vars
   editOptionCorrect(option_index, e) {
     const this_element = this.state.element;
     if (this_element.options[option_index].hasOwnProperty('correct')) {
       delete (this_element.options[option_index].correct);
     } else {
       this_element.options[option_index].correct = true;
     }
     this.setState({ element: this_element });
     this.props.updateElement.call(this.props.preview, this_element);
   }

   subAnswerOption(option_index,e){

    const this_element = this.state.element;
    if (this_element.options[option_index].hasOwnProperty('subanswer')) {
      delete (this_element.options[option_index].subanswer);
    } else {
      this_element.options[option_index].subanswer = true;
    }
 if(this_element.options[option_index].subanswer){

 }


    this.setState({ element: this_element });
    this.props.updateElement.call(this.props.preview, this_element);
  
 
   }

   subAnswerOptionRequired(option_index,e){

    const this_element = this.state.element;
    if (this_element.options[option_index].hasOwnProperty('subanswerRequired')) {
      delete (this_element.options[option_index].subanswerRequired);
    } else {
      this_element.options[option_index].subanswerRequired = true;
    }
 if(this_element.options[option_index].subanswerRequired){

 }


    this.setState({ element: this_element });
    this.props.updateElement.call(this.props.preview, this_element);
  
 
   }
   

   updateOption() {
     const this_element = this.state.element;
     // to prevent ajax calls with no change
     if (this.state.dirty) {
       this.props.updateElement.call(this.props.preview, this_element);
       this.setState({ dirty: false });
     }
   }

   addOption(index) {
     const this_element = this.state.element;
     this_element.options.splice(index + 1, 0, { value: '', text: '', key: ID.uuid() });
     this.props.updateElement.call(this.props.preview, this_element);
   }

   removeOption(index) {
     const this_element = this.state.element;
     this_element.options.splice(index, 1);
     this.props.updateElement.call(this.props.preview, this_element);
   }

   render() {
     if (this.state.dirty) {
       this.state.element.dirty = true;
     }
     return (
       <div className="dynamic-option-list">
         <ul>
           <li>
             <div className="row">
               <div className="col-sm-6"><b><IntlMessages id='options' /></b></div>
               {/* { this.props.canHaveOptionValue &&
               <div className="col-sm-2"><b><IntlMessages id='value' /></b></div> } */}
               {/* { this.props.canHaveOptionValue && this.props.canHaveOptionCorrect &&
               <div className="col-sm-2"><b>Selected</b></div> } */}
               <div className="col-sm-2"><b>Subanswer</b></div> 
               <div className="col-sm-2"><b>Subanswer required?</b></div> 
               <div className="col-sm-2"><b>Action</b></div> 
             </div>
           </li>
           {
             this.props.element.options.map((option, index) => {
               const this_key = `edit_${option.key}`;
               const val = (option.value !== this._setValue(option.text)) ? option.value : '';
               return (
                 <li className="clearfix" key={this_key}>
                   <div className="row">
                     <div className="col-sm-6">
                       <input tabIndex={index + 1} className="form-control" style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={this.updateOption.bind(this)} onChange={this.editOption.bind(this, index)} />
                     </div>
                     {/* { this.props.canHaveOptionValue &&
                     <div className="col-sm-2">
                       <input className="form-control" type="text" name={`value_${index}`} value={val} onChange={this.editValue.bind(this, index)} />
                     </div> } */}
                     {/* { this.props.canHaveOptionValue && this.props.canHaveOptionCorrect &&
                     <div className="col-sm-2 check-div">
                       <input className="form-control" type="checkbox" id={'correct_'+index} value="1" onChange={this.editOptionCorrect.bind(this, index)} checked={option.hasOwnProperty('correct')} />
                       <label htmlFor={'correct_'+index}></label>
                     </div> 
                     } */}
                      <div className="col-sm-2 check-div">
                       <input className="form-control" id={'sub_answer_'+index} type="checkbox" onChange={this.subAnswerOption.bind(this, index)} checked={option.hasOwnProperty('subanswer')}/>
                         <label htmlFor={'sub_answer_'+index}></label>
                     </div>
                     <div className="col-sm-2 check-div">
                       <input className="form-control" id={'sub_answer_required'+index} type="checkbox" onChange={this.subAnswerOptionRequired.bind(this, index)} checked={option.hasOwnProperty('subanswerRequired')}/>
                         <label htmlFor={'sub_answer_required'+index}></label>
                     </div>
                     <div className="col-sm-2">
                       <div className="dynamic-options-actions-buttons">
                         <button onClick={this.addOption.bind(this, index)} className="btn btn-success"><i className="fas fa-plus-circle"></i></button>
                         { index > 0
                           && <button onClick={this.removeOption.bind(this, index)} className="btn btn-danger"><i className="fas fa-minus-circle"></i></button>
                         }
                       </div>
                     </div>
                     
                   </div>
                 </li>
               );
             })
           }
         </ul>
       </div>
     );
   }
 }