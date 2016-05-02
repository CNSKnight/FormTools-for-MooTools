var form = document.id('formMEMREG');
form && form.store('fieldchecks', {
        "ba[address1]" : "isValueEmpty",
        "ba[address2]" : "",
        "ba[city]" : "isValueEmpty",
        "ba[company_name]" : "",
        "ba[country_id]" : "isWithoutSelectedOption",
        "ba[email]" : "isNotEmailIfNotIsValueEmpty",
        "ba[first_name]" : "isValueEmpty",
        "ba[last_name]" : "isValueEmpty",
        "ba[phone_number]" : "",
        "ba[post_nominal]" : "",
        "ba[pre_nominal]" : "",
        "ba[zip]" : "isValueEmpty",
        "pwdLenRange" : {
            "assertUsing" : "isNotLenthInRange",
            "fieldName" : "ui[acap_pw]",
            "maxLen" : null,
            "minLen" : "8"
        },
        "pwdsMatch" : {
            "assertUsing" : "isNotValuesMatch",
            "pw" : "ui[acap_pw]",
            "pwVerify" : "ui[acap_pw_v]"
        },
        "stateOrProvinceCheck" : {
            "assertUsing" : "isNotOneTrue",
            "ba[province]" : "isValueEmpty",
            "ba[state_id]" : "isWithoutSelectedOption"
        },
        "terms_agree_chk" : "isNotChecked",
        "ui[acap_pw]" : "isValueEmpty",
        "ui[acap_user]" : "isNotEmail",
        "ui[real_name]" : "isValueEmpty",
        "oo[select-multiple]" : null,
        "oo[message]" : "isValueEmpty",
        "oo[confirmation]" : "isNotOneCheckedInSet"
}).addEvent('submit', function(e){
    e.preventDefault(); 
    return runFormChecks(this, {
    submitElem: 'button[type="submit"] .ui-button-text', checkErrorsIconClass: 'ui-icon-alert'}, this.retrieve('fieldchecks'));
});

runFormChecks = function(form, options, fieldChecks) {
    if (! options) {
        options = {};
    }
    var ft = new FormTools(form, Object.append({debug: true, infoDiv: 'ftInfo'}, options), fieldChecks);
    if (ft) {
        return ft.run();
    }
};
