/**
* FormChecks
* A MooTools 1.3 class suite for validating form elements
* and other useful stuff to do with forms
*
* @feature - 100% un-obtrusive
* @feature - non-className based
* @feature - small as shyt'
* @feature - Totally extensible
* @feature - way fast
* @feature - error messages output "your way"
* @feature - extra stuff included - way? - yo.
*
* @author Codename: Steeve Knight
* @version v.01a
*
*/

/**
* Provides base of available assertions to run against form field values
* Assertions are spit out from FormChecks simply to have them easier to manage
* as of 1.3, Implemented 'Mix-Ins' must be extended objects
* 
* An assertion function is passed(elem, assertObj) from FormTools.assertUsing.
* Thus, even if the assertion is not using elem, but requres assertObj, allow for in
* the params list or cull from arguments. 
*/
Assertions = new Class ({
    failureMessages: {
        isValueEmpty: 'Please enter required information.',
        isAllValuesEmpty: 'Complete or specify at least one.',
        isNotChecked: 'Please check the box to continue.',
        isNoneCheckedInSet: 'Please choose at least one checkbox.',
        isWithoutSelectedOption: 'Please select at least one item.',
        isNotEmail: 'Must be valid email format eg. <em>me.name@someplace.com</em>.',
        isNotEmailIfNotIsValueEmpty: 'Must be empty or a valid email format eg. <em>me.name@someplace.com</em>.',
        isNotNumeric: 'Should be a number.',
        isNotInteger: 'Should be an integer.',
        isNotDateForward: 'Date must be in the future',
        isNotValuesMatch: 'These values should match.',
        isNotLenthInRange: 'Value too long or too short',
        isNotValueInRange: 'Value is out of range.',
        isNotOneTrue: 'Complete one of the following:',
        isNotValidDate: 'As entered, date is not valid.',
        isNotRightDateGTLeftDate: '%s must be greater than %s.',
        ifNotNullIsNotRightDateGTLeftDate: '%s must be blank or greater than %s.'
    },
    assertions: {
        /* Validation methods */
        isValueEmpty: function(elem) {
            elem.set('value', elem.get('value').trim());
            if (elem.get('value').length === 0) {
                this.catchFailure(elem, 'isValueEmpty');
                
                return true;
            }
        },
        isAllValuesEmpty: function(elem, assertObj) {
            var allEmpty = true;
            for (var i = 0; i < elem.length; i++) {
                elem.set('value', elem.get('value').trim());
                if (elem[i].get('value').length === 0) {
                    allEmpty = false;
                }
            }
                
            if (allEmpty) {
                this.catchFailure(elem, 'isAllValuesEmpty');

                return true;
            }
            
        },
        isNotChecked: function(elem) {
            if (! elem.get('checked')) {
                this.catchFailure(elem, 'isNotChecked');
                
                return true;
            }
        },
        isNoneCheckedInSet: function(elem) {
            var elems = elem.getElements('*:checked');
            if (elems.length === 0) {
                this.catchFailure(elem, 'isNoneCheckedInSet');
                
                return true;
            }
        },
        isWithoutSelectedOption: function(elem) {
            if (elem.get('value').trim() === '') {
                this.catchFailure(elem, 'isWithoutSelectedOption');
                
                return true;
            }
        },
        isNotEmail: function(elem) {
            if (! (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(elem.get('value'))) {
                this.catchFailure(elem, 'isNotEmail');
                
                return true;
            }
        },
        isNotEmailIfNotIsValueEmpty: function(elem) {
            elem.set('value', elem.get('value').trim());
            if (elem.get('value').length !== 0) {
                if (this.assertions.isNotEmail.bind(this)(elem)) {
                    this.catchFailure(elem, 'isNotEmailIfNotIsValueEmpty');
                    
                    return true;
                }
            }
        },
        isNotNumeric: function(elem) {
            if (typeOf(elem.get('value') -0) !== 'number') {
                this.catchFailure(elem, 'isNotNumeric');
                
                return true;
            }
        },
        isNotInteger: function(elem) {
            var val = elem.get('value') - 0;
            if (typeOf(val) !== 'number' || strpos('.', val) !== false) {
                this.catchFailure(elem, 'isNotInteger');
                
                return true;
            }
        },
        isNotDateForward: function(elem) {
            var dtm = new Date(elem.get('value'));
            if (dtm && dtm <= new Date()) {
                this.catchFailure(elem, 'isNotDateForward');
                
                return true;
            }
        },
        /**
        * Two or more values will be checked for equality
        * note the form available as 'this' w/in each'd lambda
        */
        isNotValuesMatch: function(elem, assertObj) {
            var chkVal, matchVal = null, result = null;
            Object.each(assertObj, function(fieldName, idx, assertObj) {
                    if (idx !== 'assertUsing') {
                        var chkElem = this.getElem(fieldName);
                        if (chkElem) {
                            chkVal = chkElem.get('value');
                        }
                        if (matchVal === null) {
                            matchVal = chkVal;
                        } else if (chkVal !== matchVal) {
                            
                            result = true;
                        }
                    }
            }.bind(this));
            
            if (result) {
                Object.each(assertObj, function(fieldName, idx, assertObj) {
                        if (idx !== 'assertUsing') {
                            this.cl('----'+fieldName);
                            this.catchFailure(this.getElem(fieldName), '');
                        }
                }.bind(this));
                
                var legend;
                if (this.failureMessages.isNotValuesMatch) {
                    legend = this.failureMessages.isNotValuesMatch;
                } else {
                    legend = 'These values must match:';
                }
                
                this.lastFailureMsg = 
                '<fieldset><legend>'+legend+'</legend>'+ this.lastFailureMsg + '</fieldset>';
                
                return true;
            }
        },
        /**
        * asserts 
        * - strict range
        * - only max via null min
        * - only min via null max
        */
        isNotLenthInRange: function(elem, assertObj) {
            var chkLen = elem.get('value').length;
            
            if ((assertObj.minLen > 0 && chkLen < assertObj.minLen) || (assertObj.maxLen > 0 && chkLen > assertObj.maxLen)) {
                this.catchFailure(elem, 'isNotLenthInRange');
                
                return true;
            }
            
            return false;
        },
        isNotValueInRange: function(elem, assertObj) {
            var chkVal = elem.get('value');

            if (! chkVal >= assertObj.minVal && chkVal <= assertObj.maxVal) {
                this.catchFailure(elem, 'isNotValueInRange');
                
                return true;
            }
            
            return false;
        },
        isNotOneTrue: function(elem, assertObj) {
            var trueCnt = 0;
            Object.each(assertObj, function(assertionName, fieldName, assertObj) {
                    if (fieldName !== 'assertUsing') {
                        if (this.processFieldChk(assertionName, fieldName)) {
                            trueCnt++;
                        }
                    }
            }.bind(this));
            
            if (trueCnt !== 1) {
                var legend;
                if (this.failureMessages.isNotOneTrue) {
                    legend = this.failureMessages.isNotOneTrue;
                } else {
                    legend = 'Complete <b>one (1)</b> of the following:';
                }
                
                this.lastFailureMsg = '';
                Object.each(assertObj, function(assertionName, fieldName, assertObj) {
                        if (fieldName !== 'assertUsing') {
                            var elem = this.getElem(fieldName);
                            if (elem) {
                                this.catchFailure(elem, assertionName);
                            }
                        }
                }.bind(this));
                
                this.lastFailureMsg = 
                '<fieldset><legend>'+legend+'</legend>'+ this.lastFailureMsg + '</fieldset>';
		        
                return true;
            } else {
                this.lastFailureMsg = '';
                this.lastFailureElems.empty();
                return false;
            }
        },
        // @todo - convert to use extended Date?
        // @todo Date.parse('foo') === 'Invalid Date';  Include Date.extras.js for extended formats support
        isNotValidDate: function(elem) {
            var dtCh= /[\-|\/]/;
            var now = new Date();
            var minYear=1900;
            var maxYear= now.getFullYear() - 20;
            var daysInMonth = function() { //formerly DaysArray()
                for (var i = 1; i <= 12; i++) {
                    this[i] = 31;
                    if (i==4 || i==6 || i==9 || i==11) {
                        this[i] = 30;
                    } else if (i==2) {
                        this[i] = 29;
                    }
                }
                
                return this;
            };
            var pos1=elem.get('value').indexOf(dtCh);
            var pos2=elem.get('value').indexOf(dtCh,pos1+1);
            var strMonth=elem.get('value').substring(0,pos1);
            var strDay=elem.get('value').substring(pos1+1,pos2);
            var strYear=elem.get('value').substring(pos2+1);
            var strYr=strYear;
            var month, day, year;
            if (strDay.charAt(0)=="0" && strDay.length>1) {
                strDay=strDay.substring(1);
                if (strMonth.charAt(0)=="0" && strMonth.length>1) {
                    strMonth=strMonth.substring(1);
                }
                for (var i = 1; i <= 3; i++) {
                    if (strYr.charAt(0)=="0" && strYr.length>1) {
                        strYr=strYr.substring(1);
                    }
                }
            }
            month=parseInt(strMonth);
            day=parseInt(strDay);
            year=parseInt(strYr);
            if (pos1==-1 || pos2==-1){
                errorTip = "Format must be : mm-dd-yyyy";
                return true;
            }
            if (strMonth.length<1 || month<1 || month>12){
                errorTip = "Month JAN-DEC";
                return true;
            }
            if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
                errorTip = "Day of month.";
                return true;
            }
            if (strYear.length != 4 || year===0 || year<minYear || year>maxYear){
                errorTip = "Year range between "+minYear+" and "+maxYear;
                return true;
            }
            if (elem.get('value').indexOf(dtCh,pos2+1) != -1 || isNotInteger(stripCharsInBag(elem.get('value'), dtCh)) === false){
                errorTip = "Entire date";
                return true;
            }

            return false;
        },
        isNotRightDateGTLeftDate: function(elem, assertObj) {
            var chkElemL = this.getElem(assertObj.left);
            if (chkElemL) {
                chkValL = chkElemL.get('value');
            } else {
                chkValL = assertObj.left;
            }
            var chkDateL = chkValL ? this.utils.genDate(chkValL).clearTime() : null;
            
            var chkElemR = this.getElem(assertObj.right);
            if (chkElemR) {
                chkValR = chkElemR.get('value');
            } else {
                chkValR = assertObj.right;
            }
            var chkDateR = chkValR ? this.utils.genDate(chkValR).clearTime() : null;
            
            if (! (typeOf(chkDateR) === 'date' && typeOf(chkDateL) === 'date')) {
                this.cl('One of '+assertObj.left+', '+assertObj.right+' has a null value?', 'debug');
                
                return null;
            }
            
            var result = ! (chkDateR.getTime() > chkDateL.getTime());
            
            if (result) {
                var msg = this.failureMessages.isNotRightDateGTLeftDate;
                var labelL = this.matchLabel(chkElemL);
                if (labelL) {
                    this.lastFailureElems.push({elem: chkElemL, assertionName: 'isNotRightDateGTLeftDate', label: labelL}); 
                    labelL = labelL.get('text');
                } else {
                    labelL = chkElemL ? chkElemL.name : chkDateL ? chkDateL.format(this.options.dateDisplayFormat) : '???';
                }
                var labelR = this.matchLabel(chkElemR);
                if (labelR) {
                    this.lastFailureElems.push({elem: chkElemR, assertionName: 'isNotRightDateGTReftDate', label: labelR}); 
                    labelR = labelR.get('text');
                } else {
                    labelR = chkElemR ? chkElemR.name : chkDateR ? chkDateR.format(this.options.dateDisplayFormat) : '???';
                }
                this.setLastFailureMsg(labelR, sprintf(msg, labelR, labelL));
                
                return true;
            }
            
            return false;
        },
        ifNotNullIsNotRightDateGTLeftDate: function(elem, assertObj) {
            var chkElemR = this.getElem(assertObj.right);
            if (chkElemR) {
                if (chkElemR.get('value')) {
                    return this.assertions.isNotRightDateGTLeftDate.bind(this)(elem, assertObj);
                } else {
                    return false;
                }
            }
        }
    }
});

/**
* setup fieldChecks seperately in the page describing the form thusly
*
* <script type="text/javascript"><!--//--><![CDATA[//><!--
* documnt.id('#myForm').addEvent('submit', function() {
*       acap.runFormChecks(this, fieldChecks = {
*        	'ia[city]': 'isValueEmpty',
*        	'0': {
* 		      'ia[state_id]': 'isWithoutSelectedOption',
* 		      'ia[province]': 'isValueEmpty'
* 		      },
* 	       'ia[zip]': 'isValueEmpty',
* 	       'ia[country_id]': 'isWithoutSelectedOption',
* 	       'ia[county_id]': '',
*       'someFormElementName': {
*            assert: 'isValueEmpty',
*            fName: 'myFormElementName[]'
*           }
* 	       });
* //--><!]]></script>
* <script type="text/javascript" src="FormChecks.js"></script>
*
* see Assertions for available validation calls
*/
(function($) {
FormTools = new Class({
        status: false,
        Implements: [Class.Occlude, Options, Events, Assertions],
        Binds: ['position', 'hide', 'processFieldChk', 'assertUsing', 'catchFailure', 'processFailure'],
        options: {
            debug: false,
            errorColor: '#FF0000',
            validColor: '#A9A9A9',
            processFailure: null,
            onFailures: null,
            onSuccess: null,
            maskForm: true,
            infoDiv: null,
            useInfoDivCloser: true,
            useDialog: false,
            msgTemplate: '<div class="acap_serious"><p><span class="phpCCSpclCs specialCase">%s</span> %s</p></div>',
            submitElem: 'input[type="submit"]',
            // these can be html if supported by submitElem
            checkingValuesText: 'Checking Values...',
            checkErrorsText: 'Check Errors!',
            checkErrorsIconClass: null,
            continuingText: 'Continuing...',
            mySQLDate: '%Y-%m-%d',
            dateDisplayFormat: '%A, %b %d, %Y',
            getElemUsesAlt: false,
            dummy: null
        },
        infoDiv: null,
        labels: '',
        chkForm: '',
        fieldChks: '',
        submitElem: '',
        failureCnt: 0,
        lastFailureElems: [],
        failureElemsPool: [],
        lastFailureMsg: '',
        failureMsgPool: '',
        element: null,
        property: 'FormToolsInst',
        initialize: function(form, options, fieldChks) {
            this.element = $(form);
            if (this.occlude()) {
                if (this.occluded.failureElemsPool.length) {
                    Array.each(this.occluded.failureElemsPool, function(failure) {
                            $(failure.elem).setStyle('outline', 'none');
                    });
                }
                
                return this.occluded;
            }
            
            this.setOptions(options);
            if (this.setForm() && this.setFieldChks(fieldChks)) {
                this.setSubmit();
                this.setLabels();
                this.checkMapings();
                this.setInfoDiv();
                if (this.options.processFailure && typeOf(this.options.processFailure) === 'function') {
                    this.processFailure = this.options.processFailure;
                }
                this.status = true;
            } else {
                this.cl('FormTools should be Constructed (Initialized) with a valid form id string or element and set of fieldChks (array) as its\' parameters', 'error');
                return false;
            }
        },
        setForm: function() {
            if (! this.element || this.element.get('tag') !== 'form') {
                this.cl('I don\'t have a form object or viable selector! Either provide the object, a selector, or omit use of FormTools.', 'error');
                return false;
            } else {
                this.chkForm = this.element;
            }
            
            return true;
        },
        setFieldChks: function(fieldChks) {
            var test = typeOf(fieldChks);
            if (test !== 'object' && test !== 'array') {
                this.cl("The 'fieldChks' JSON object/array "+fieldChks+" for "+this.chkForm.id+" was not provided. Either make available and in valid JSON or omit use of FormTools");
                
                return false;
            }
            
            this.fieldChks = new Hash(fieldChks);
            if (! this.fieldChks.getKeys().length) {
                this.cl('FieldChks: '+fieldChks+' is empty.');
                return false;
            }
            
            return true;
        },
        setSubmit: function() {
            if (this.options.submitElem) {
                this.submitElem = this.chkForm.getElement(this.options.submitElem);
                if (this.submitElem) {
                    if (this.submitElem.get('tag') !== 'input') {
                        this.submitElem.store('origText', this.submitElem.getProperty('html'));
                    } else {
                        this.submitElem.store('origText', this.submitElem.getProperty('value'));
                    }
                }
            }
        },
        setLabels: function() {
            this.labels = this.chkForm.getElements('label');
            if (this.labels) {
                this.labels.setStyle('color', this.options.validColor);
            }
        },
        mapCheck: function(val, key, Hash) {
            if (typeOf(val) === 'object') {
                // find and map the names
                Object.each(val, function(fieldName, key) {
                        if (['fieldName', 'left', 'right'].contains(fieldName) && ! this.getElem(fieldName)) {
                            this.cl('What is '+fieldName+'?');
                        }
                });
            } else if (! this.chkForm[key]) {
                this.cl('What is '+key+"?\n");
            }
        },
        checkMapings: function() {
            // @note fieldChks now a 'Hash'
            this.fieldChks.each(this.mapCheck, this);
        },
        setInfoDiv: function() {
            if (! this.options.infoDiv) {
                this.cl('infoDiv option omitted. Using dialog instead.');
                this.infoDiv = new Element('div', {styles:{display:'none'}}).grab(new Element('fieldset').grab(new Element('legend', {text: 'InfoDiv'})));
                this.chkForm.getParent().grab(this.infoDiv);
                this.options.useDialog = true;
            } else {
                this.infoDiv = $(this.options.infoDiv);
                if (! this.infoDiv) {
                    this.options.infoDiv = null;
                    this.setInfoDiv();
                }
            }
            
            this.infoDiv.chains();
        },
        initInfoDiv: function() {
            var pos = this.infoDiv.empty().getStyle('position');
            
            if (this.options.useInfoDivCloser) {
                if (pos == 'fixed' || pos == 'absolute') {
                    this.infoDiv.grab(
                        new Element('button', {
                                id: 'ftInfo-hider',
                                events: {
                                    click: function(e) {
                                        e.stopPropagation();
                                        this.parentNode.fade('out');
                                        $('aml-async-scroll').empty();
                                    }
                                },
                                text: '[close]',
                                styles: {
                                    color: '#FF0000'
                                }
                        })
                        );
                }
                
                this.infoDiv.grab(new Element('fieldset', {})
                    .grab(new Element('legend', {text: 'Form Process Information:'}))
                    .grab( new Element('p', {text: 'Now checking your form values... :D'}))
                    );
            }
            
            if (pos == 'fixed' || pos == 'absolute') {
                this.infoDiv.fade('out').setStyle('display', 'block').fade('in');
            }
        },
        getElem: function(fieldName) {
            if (! fieldName) {
                return false;
            } else {
                var hint = 'Locating form element with [name*="'+fieldName+'"]';
                var elem = this.chkForm.getElement('[name*="'+fieldName+'"]');
                if (! elem && this.options.getElemUsesAlt) {
                	// ie sometimes misses on the above, so now we'll attempt an alternate hunt-peck for the desired element
                	var elems = this.chkForm.getElements('[name]:enabled');
                	if (elems) {
                		elems.each(function(fElem) {
                				if ($(fElem).get('name').contains(fieldName)) {
                					elem = fElem;
                					return false;
                				}
                		});
                	}
                }
                if (elem) {
                    this.cl(hint+' (succeeded)');
                    return elem;
                } else {
                    this.cl(hint+' (failed)');
                }
            }
        },
        run: function() {
            if (! this.status) {
                return false;
            }
            if (this.labels) {
                this.labels.set('style', '');
            }
            this.failureMsgPool = '';
            this.failureCnt = 0;
            
            if (! this.options.useDialog) {
                this.initInfoDiv();
            }
            
            this.setSubmitText(this.options.checkingValuesText);
            this.processFieldChks();
            
            if (this.failureCnt > 0) {
                return this.onFailures();
            } else {
                return this.onSuccess();
            }
        },
        /**
        * processFieldChk wrapped here so that onCheckFailure can be called after the
        * master completes due that processFieldChk is also called from more complex
        * assertions, eg isNotOneTrue.
        */
        processFieldChks: function() {
            this.fieldChks.each(function(assertObj, idxOrElemName) {
                    var result = this.processFieldChk(assertObj, idxOrElemName);
                    if (result === true) {
                        this.onCheckFailure();
                        this.failureCnt++;
                    }
                    
                    this.cl('-Result: '+(typeOf(result) === 'boolean' ? result.toString() : 'null'));
            }.bind(this));
        },
        processFieldChk: function(assertObj, idxOrElemName) {
            var cnt, elCnt, fElem, result;
            
            switch(typeOf(assertObj)) {
            case 'string': // the name of a function to call
                if (! assertObj.trim()) {
                    return null; // elegantly allow null assertions (placeholder?)
                }
            case 'function': // a lambda to use
                if (idxOrElemName) {
                    fElem = this.getElem(idxOrElemName);
                    if (fElem) {
                        result = this.assertUsing(assertObj, fElem, null);
                    }
                }
                break;
            case 'object': 
                if (typeOf(assertObj.assertUsing) != 'null') {
                    if (typeOf(assertObj.fieldName) != 'null') {
                        fElem = this.getElem(assertObj.fieldName);
                    }
                    // fElem cool if still null
                    switch(typeOf(assertObj.assertUsing)) {
                        case 'string':
                        case 'function':
                            result = this.assertUsing(assertObj.assertUsing, fElem, assertObj);
                            
                            break;
                        case 'array':
                            assertObj.assertUsing.each(function(assertObj, idx) {
                                    result = this.processFieldChk(assertObj, fElem ? fElem.get('name') : null);
                            }.bind(this));
                            break;
                        default:
                            this.cl('Object at '+idxOrElemName+' is not assertable', 'warn');
                            break;
                        }
                }

                break;
            case 'array': // a legacy setup
                cnt = elCnt = 0;
                for (var aidx in assertObj) {
                    elCnt++;
                    /*find issues in markup*/
                    if (! $(this.chkForm[aidx])) {
                        this.cl("What is "+aidx+"? L2");
                    }
                    continue;
                }
                result = this.assertUsing(assertObj[aidx], $(this.chkForm[aidx]), assertObj);
                if (result) {
                    cnt++;
                }

                break;
            default:
                if (this.options.debug) {
                    this.cl(idxOrElemName+' in fieldChks is not assertable', 'warn');
                }
            }
            
            return result;
        },
        /**
        * always return true on invalid
        * we're skipping checkable but hidden elements
        * @note this method plays a particularly important role by providing
        * 'this' environment to an assertable
        */
        assertUsing: function(assertUsing, chkObj, assertObj) {
            if (chkObj) {
                if (typeOf(chkObj.type) !== 'null' && chkObj.type == 'hidden') {
                    this.cl('-Hidden element not asserted');
                    result = false;
                }
                
                var what = null, kind = '?'; 
                if (typeOf(chkObj.name) != 'null') {
                    what = chkObj.name;
                    kind = chkObj.get('tag');
                } else if (typeOf(chkObj.toSource) != 'null') {
                    what = chkObj.toSource();
                } else {
                    what = chkObj.toString();
                }
                
                this.cl('-Asserting '+kind+'::'+what);
            } else {
                this.cl('-Asserting with [object]');
            }
            
            if (typeOf(assertUsing) === 'function') {
                this.cl('-Using lambda: '+assertUsing.toString());
                assertUsing.bind(this);
            } else if (typeOf(assertUsing) == 'string' && typeOf(this.utils[assertUsing]) === 'function') {
                this.cl('Using FormTools.utils.'+assertUsing);
                assertUsing = this.utils[assertUsing].bind(this);
            } else if (typeOf(this.assertions[assertUsing]) !== 'function') {
                this.cl(assertUsing+' is not an assertable function.', 'warn');
                return false;
            } else {
                this.cl('-Using FormTools.assertions.'+assertUsing);
                assertUsing = this.assertions[assertUsing].bind(this);
            }
            
            return assertUsing(chkObj, assertObj);
        },
        matchLabel: function(elem) {
            var labMatch = null;
            
            if (elem && this.labels) {
                this.labels.each(function(label, idx) {
                        if (label.htmlFor === elem.id) {
                            labMatch = label;
                            return false;
                        }
                });
            }
            
            if (labMatch) {
                return labMatch;
            }
            
            return false;
        },
        setLastFailureMsg: function(labelText, msgText) {
            this.lastFailureMsg += sprintf(this.options.msgTemplate, labelText, msgText);
        },
        /**
        * the assertionName can be null for cases where additional
        * error text might be confusing - eg w/isNoValuesMatch
        */
        catchFailure: function(elem, assertionName) {
            var msgText = '';
            
            if (assertionName) {
                msgText = this.failureMessages[assertionName] ||  '-'+assertionName+'-';
            }
            
            if (msgText) {
                msgText = ' ('+msgText+') ';
            }
            
            var label = this.matchLabel(elem);
            
            if (label !== false) {
                this.setLastFailureMsg(label.get('text'), msgText);
            } else {
                this.setLastFailureMsg(elem.name, msgText);
            }
            
            this.lastFailureElems.push({elem: elem, assertionName: assertionName, label: label});
        },
        processFailure: function(elem, assertionName, label) {
            if (! $(elem)) {
                this.cl(elem);
                return;
            }
            
            $(elem).setStyles({
                    outlineColor: this.options.errorColor,
                    outlineWidth: '1px',
                    outlineStyle: 'solid'
            });
            
           if (label) {
               label.setStyles( {
                       color: '#FF0000',
                       borderBottomColor: this.options.errorColor,
                       borderBottomWidth: '1px',
                       borderBottomStyle: 'solid'
               });
           }
        },
        onCheckFailure: function() {
            Array.each(this.lastFailureElems, function(failure) {
                    this.processFailure(failure.elem, failure.assertionName, failure.label);
            }.bind(this));
            Array.append(this.failureElemsPool, this.lastFailureElems);
            this.lastFailureElems.empty();
            this.failureMsgPool += this.lastFailureMsg;
            this.lastFailureMsg = '';
        },
        onFailures: function() {
            this.infoDiv.getElement('fieldset').empty().set('html', this.failureMsgPool)
            .grab(new Element('legend', {text: 'Errors in Form:'}), 'top');
            
            var pos = this.infoDiv.getStyle('position');
            
            if (pos == 'fixed' || pos == 'absolute') {
                if (this.fadeOutTimeout) {
                    clearTimeout(this.fadeOutTimeout);
                }
                this.fadeOutTimeout = setTimeout(function() { this.fade('out'); }.bind(this.infoDiv), 1000*9);
            }
            
            this.setSubmitText(this.options.checkErrorsText, this.options.checkErrorsIconClass);
            
            return false;
        },
        onSuccess: function() {
            this.infoDiv.getElement('fieldset').empty()
            .grab(new Element('legend', {text: 'Form Processing Info:'}))
            .grab(new Element('p', {text: 'All values checked ok.'}));
            
            var pos = this.infoDiv.getStyle('position');
            
            if (pos == 'fixed' || pos == 'absolute') {
                if (this.fadeOutTimeout) {
                    clearTimeout(this.fadeOutTimeout);
                }
                this.fadeOutTimeout = function() { this.fade('out'); }.delay(7000, this.infoDiv);
            }
            
            if (this.submitElem) {
                this.setSubmitText(this.submitElem.retrieve('origText')+' '+this.options.continuingText);
            }
            
            return true;
        },
        setSubmitText: function(text, iconClass) {
            if (! this.submitElem) { return; }

            if (this.submitElem.get('tag') !== 'input') {
                // text can actually be html at this point and supported by the tag eg <button/>
                this.submitElem.setProperty('text', text);
                if (iconClass) {
                    var button = this.submitElem.getParent('[role="button"]');
                    if (button) {
                        button.getElement('span[class~="ui-icon"]').addClass(iconClass);
                    }
                }
            } else {
                this.submitElem.setProperty('value', text);
            }
        },
        utils: {
            /**
            * dateStr may be an integer (timestamp), a string thereof,
            * or some formatted date
            */
            genDate: function(dateStr) {
                var dateVal = dateStr - 0;
                if (isNaN(dateVal)) {
                    dateVal = dateStr;
                }
                
                return new Date().parse(dateVal);
            },
            /**
            * Utility methods
            */
            /**
            * castDateSelectsStr - token-based date parts assembler
            * drops a JS timestamp into the value attribute of the elem passed in.
            * To convert to a format, simply place an addEvent('change, fn) onto the element eg:
            * if (typeOf(dateVal) === 'number') {
            *     str = new Date(dateVal).format('%Y-%m-%d');
            * }
            * @param object - an extended input[type="text"] dom element
            */
            castDateSelectsStr: function(dateStrElem) {
                if (dateStrElem) {
                    tokn = dateStrElem.getProperty('rel');
                    if (tokn) {
                        var Y, m, d;
                        this.chkForm.getElements('select[name^='+tokn+']').each(function(elem) {
                                switch (elem.name.substring(tokn.length)) {
                                case '[Y]':
                                    Y = elem.get('value') * 1;
                                    break;
                                case '[m]':
                                    m = elem.get('value') * 1;
                                    break;
                                case '[d]':
                                    d = elem.get('value') * 1;
                                    break;
                                }
                        });
                        if (Y && m && d) {
                            var dateObj = new Date(Y, m-1, d);
                            this.cl(dateObj.toString());
                            dateStrElem.setProperty('value', dateObj.getTime());
                        } else {
                            dateStrElem.setProperty('value', '');
                        }
                    }
                }
            },
            /**
            * construct date - id-based date parts assembler
            */
            constructDate: function(dateId, mId, dId, yId) {
                var ms = document.getElementById(mId);
                var month = 0;
                for(var i = 0; i < ms.length; i++) {
                    if (ms[i].selected) {
                        if (ms[i].get('value').length && ms[i].get('value') !== 0) {
                            month = ms[i].get('value');
                        }
                    }
                }
                var newDateStr = month+'-'+document.Id(dId).get('value')+'-'+document.Id(yId).get('value');
                
                document.Id(dateId).set('value', newDateStr);
            }
        },
        clearformdefaults: function(fldids) {
            for (var idx in fldids) {
                var fld = document.getElementById(fldids[idx]);
                if (fld) {
                    if (fld.title == fld.get('value')) {
                        fld.set('value', '');
                    }
                }
            }
        },
        anotherTool:{
        },
        cl: function(msg, level) {
            if (! level) {
                level = 'debug';
            }
            
            if (typeOf(window.console) != 'null') {
                if (this.options.debug && level === 'debug' && typeOf(console.debug) == 'function') {
                        console.debug(msg);
                } else if (typeOf(console[level]) == 'function') {
                    console[level](msg);
                } else {
                    console.log(msg);
                }
            }
        }
});
})(document.id); // end of class FormTools
