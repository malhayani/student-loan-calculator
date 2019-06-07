/* --- INFO OBJECTS --- */
var generalInfo = {
    totalLoanBalance: 0.00,
    averageInterestRate: 0.00,
    inflationRateAssumption: 3.0,
    loanPaymentStartYear: 0,
    nonProfitOrGov: false,
    before10_1_2007: false
}

var personalInfo = {
    currentFamilySize: 0,
    taxStatus: true,
    futureChildren: []
}

var incomeInfo = {
    years: [],
    income: [],
    salaryGrowth: 3.0,
    spouseIncome: [],
    spouseSalaryGrowth: 3.0
}

/* --- FORM META DATA --- */
var form = [
    {
        field: 'totalLoanBalance',
        origin: generalInfo.totalLoanBalance,
        setOrigin: function (val) { generalInfo.totalLoanBalance = val },
        $el: document.getElementById('totalLoanBalance'),
        $form: document.getElementById('generalInfo'),
        validation: isNumber,
        format: formatFloat,
        errorMsg: 'Total loan value must be a number greater than 0',
        eventListener: inputEventListener,
        eventType: 'blur'
    },
    {
        field: 'averageInterestRate',
        origin: generalInfo.averageInterestRate,
        setOrigin: function (val) { generalInfo.averageInterestRate = val },
        $el: document.getElementById('averageInterestRate'),
        $form: document.getElementById('generalInfo'),
        validation: isPercent,
        format: formatFloat,
        errorMsg: 'Average interest rate must be a number less than 100',
        eventListener: inputEventListener,
        eventType: 'blur'
    },
    {
        field: 'loanPaymentStartYear',
        origin: generalInfo.loanPaymentStartYear,
        setOrigin: function (val) { generalInfo.loanPaymentStartYear = val },
        $el: document.getElementById('loanPaymentStartYear'),
        $form: document.getElementById('generalInfo'),
        validation: isYear,
        format: formatYear,
        errorMsg: 'Loan payment start year must be a year',
        eventListener: inputEventListener,
        eventType: 'blur'
    },
    {
        field: 'nonProfitOrGov',
        origin: generalInfo.nonProfitOrGov,
        setOrigin: function (val) { generalInfo.nonProfitOrGov = val },
        $el: document.getElementsByClassName('nonProfitOrGov'),
        $form: document.getElementById('generalInfo'),
        format: formatBoolean,
        eventListener: checkBoxEventListener,
        eventType: 'click'
    },
    {
        field: 'before10_1_2007',
        origin: generalInfo.before10_1_2007,
        setOrigin: function (val) { generalInfo.before10_1_2007 = val },
        $el: document.getElementsByName('before10_1_2007'),
        $form: document.getElementById('generalInfo'),
        format: formatBoolean,
        eventListener: checkBoxEventListener,
        eventType: 'click'
    },
    {
        field: 'currentFamilySize',
        origin: personalInfo.currentFamilySize,
        setOrigin: function (val) { personalInfo.currentFamilySize = val },
        $el: document.getElementById('currentFamilySize'),
        $form: document.getElementById('personalInfo'),
        validation: isNumber,
        format: formatInteger,
        errorMsg: 'Current family size must be a number greater than 0',
        eventListener: inputEventListener,
        eventType: 'blur'
    },
    {
        field: 'taxStatus',
        origin: personalInfo.taxStatus,
        setOrigin: function (val) { personalInfo.taxStatus = val },
        $el: document.getElementsByName('taxStatus'),
        $form: document.getElementById('personalInfo'),
        format: formatBoolean,
        eventListener: checkBoxEventListener,
        eventType: 'click'
    }
]

/* --- VALIDATORS --- */
function isNumber (val) {
    val = val.toString().replace(',', '')
    if (!isNaN(val)) {
        if (val > 0) {
            return true
        }
    }
    return false
}

function isPercent (val) {
    val = val.toString().replace(',', '')
    if (!isNaN(val)) {
        if (parseFloat(val) <= 100) {
            return true
        }
    }
    return false
}

function isYear (val) {
    if (!isNaN(val)) {
        if (val >= new Date().getFullYear() - 100 && val <= new Date().getFullYear() + 100) return true
    }
    return false
}

function isFutureYear (val) {
    if (!isNaN(val)) {
        if (val >= new Date().getFullYear() && val <= 9999) return true
    }
    return false
}

function validateForm ($form) {
    var errors = $form.getElementsByClassName('error')
    var invalids = $form.getElementsByClassName('invalid')
    if (errors.length > 0 || invalids.length > 0) {
        $form.getElementsByClassName('next-btn')[0].disabled = true
    } else {
        $form.getElementsByClassName('next-btn')[0].disabled = false
    }
    console.log(generalInfo, personalInfo, incomeInfo)
}

/* --- FORMATTERS --- */
function formatFloat (val) {
    val = val.toString().replace(',', '')
    return val ? parseFloat(val).toFixed(2) : '';
}

function formatYear (val) {
    return val ? parseInt(val) : new Date().getFullYear()
}

function formatBoolean (val) {
    return val == 'true'
}

function formatInteger (val) {
    val = val.toString().replace(',', '')
    return val.includes('.') ? parseInt(val.split('.')[0]) : parseInt(val)
}

/* --- HELPER FUNCTIONS --- */
function addError (self) {
    document.getElementById(self.field + 'ErrorMsg').innerHTML = self.errorMsg
    self.$el.classList.add('error')
    self.$el.classList.add('invalid')
}

function removeError(self) {
    document.getElementById(self.field + 'ErrorMsg').innerHTML = ''
    self.$el.classList.remove('error')
    self.$el.classList.remove('invalid')
}

function checkBoxIconSwap (name, id) {
    var $elements = document.getElementsByName(name)
    for (var i = 0; i < $elements.length; i++) {
        $elements[i].classList.remove('fa')
        $elements[i].classList.remove('fa-check-circle')
        $elements[i].classList.add('far')
        $elements[i].classList.add('fa-circle')
    }
    $el = document.getElementById(id)
    $el.classList.remove('far')
    $el.classList.remove('fa-circle')
    $el.classList.add('fa')
    $el.classList.add('fa-check-circle')
}


/* --- EVENT HANDLERS ---*/
// Event Handler for input fields
function inputEventListener (e) {
    // Find self in form object
    function findSelf (target) {
        return form.filter(function (x) { 
            return x.$el === target 
        })[0]
    }

    function set (val) {
        self.setOrigin(val)
        self.$el.value = val
    }

    var self = findSelf(e.target)
    if (self) {
        var input = e.target.value
        if (self.validation(input)) {
            removeError(self)
            set(self.format(input))
        } else {
            addError(self)
        }
        if (!input) {
            self.$el.classList.remove('error')
        }

        validateForm(self.$form)
    }
}

// Event Handler for check boxes
function checkBoxEventListener (e) {
    var name = e.target.getAttribute('name')
    checkBoxIconSwap(name, e.target.id)

    // Find self in form object
    function findSelf (target) {
        return form.filter(function (x) {
            for (var i = 0; i < x.$el.length; i++) {
                if (x.$el[i] === target) return x
            }
        })[0]
    }

    var self = findSelf(e.target)
    if (self) {
        self.setOrigin(self.format(e.target.getAttribute('data-text')))
    }
}

// Event Handler for NEXT/BACK buttons
function showView (e) {
    document.getElementById('generalInfo').classList.add('hide')
    document.getElementById('personalInfo').classList.add('hide')
    document.getElementById('incomeInfo').classList.add('hide')
    document.getElementById(e.target.getAttribute('data-text')).classList.remove('hide')
    if (e.target.getAttribute('data-text') === 'incomeInfo') generateIncomeTable()
    validateForm(document.getElementById(e.target.getAttribute('data-text')))
}


/* --- FUTURE CHILDREN FUNCTIONALITY ---*/
// Shows or hides the future children table
function displayFutureChildren (bool) {
    var $futureChildren = document.getElementById('futureChildrenInput')
    if (bool) {
        $futureChildren.classList.remove('hide')
        checkBoxIconSwap('futureChildrenDisplay', 'futureChildrenDisplayYes')
        // only append a row if the table has now rows in it
        if (personalInfo.futureChildren.length === 0) appendChild()
    } else {
        $futureChildren.classList.add('hide')
        checkBoxIconSwap('futureChildrenDisplay', 'futureChildrenDisplayNo')
        removeChildren(null)
    }
    validateForm(document.getElementById('personalInfo'))
}

// Dynamically adds HTML to Future Child Table
function addFutureChildRow (index) {
    function addTableRow (index) {
        var $futureChildrenTable = document.getElementById('futureChildrenTable')
        var childRow = $futureChildrenTable.insertRow(index)
        var childLabel = childRow.insertCell(0)
        var birthYear = childRow.insertCell(1)
        var removeChild = childRow.insertCell(2)
    
        var classList = 'input-field'
        if (!isFutureYear(personalInfo.futureChildren[index])) {
            classList += ' invalid'
        }
        childLabel.innerHTML = 'Child ' + (index + 1)
        birthYear.innerHTML = '<input id="futureChildren_' + index + '" class="' + classList + '" placeholder="Enter birth year" value="' + personalInfo.futureChildren[index] + '"/>' +
                                '<p id="futureChildren_' + index + 'ErrorMsg" class="errorMsg"></p>'
        if (index != 0) {
            removeChild.innerHTML = '<div onclick="removeChildren(' + index + ')" class="remove-child-btn"><i class="fa fa-times"/></div>'
        }
    }

    function addEventListener () {
        document.getElementById('futureChildren_' + index).addEventListener('blur', function (e) {
            var index = e.target.id.split('_')[1]
            var val = e.target.value
        
            if (isFutureYear(val)) {
                personalInfo.futureChildren[index] = val
                removeError({$el: e.target, field: e.target.id, errorMsg: ''})
            } else {
                addError({$el: e.target, field: e.target.id, errorMsg: 'Must be valid year and in the future'})
            }
            validateForm(document.getElementById('personalInfo'))
        })
    }

    addTableRow(index)
    addEventListener()
}

// Adds a child to the personal information object when 'Add Child' is clicked
function appendChild () {
    personalInfo.futureChildren.push('')
    var $futureChildrenTable = document.getElementById('futureChildrenTable')
    addFutureChildRow($futureChildrenTable.children.length)
    validateForm(document.getElementById('personalInfo'))
}

// Based on index passed, removes single child or entire child list and repaints HTML table
function removeChildren(index) {
    if (index) {
        personalInfo.futureChildren.splice(index, 1)
    } else {
        personalInfo.futureChildren = []
    }

    function repaintTable () {
        var $futureChildrenTable = document.getElementById('futureChildrenTable')
        $futureChildrenTable.innerHTML = ''
        for (var i = 0; i < personalInfo.futureChildren.length; i++) {
            addFutureChildRow(i)
        }
    }
    repaintTable()
    validateForm(document.getElementById('personalInfo'))
}

/* --- INCOME VIEW --- */
function generateIncomeTable () {
    var $incomeTableHead = document.getElementById('incomeTableHead')
    var $incomeTableBody = document.getElementById('incomeTableBody')
    var isMarried = !personalInfo.taxStatus

    function generateTableHeader ($el) {
        $el.innerHTML = ''
        var headers = isMarried ? ['Year', 'Your Salary', 'Spouse\'s Salary'] : ['Year', 'Your Salary']
        var headerRow = $el.insertRow(0)
        headerRow.classList.add('income-headers')
        for (var i = 0; i < headers.length; i++) {
            var cell = headerRow.insertCell(i)
            cell.innerHTML = '<label>' + headers[i] + '</label>'
        }
    }
    function generateTableBody($el) {
        $el.innerHTML = ''
        for (var i = 0; i < 10; i++) {
            var row = $el.insertRow(i)
            row.classList.add('income-table-row')
            var cell1 = row.insertCell(0)
            cell1.classList.add('income-year')
            if (i === 0) {
                cell1.innerHTML = '<input id="paymentYear_' + i + '" class="input-field input-income-year" placeholder="Enter payment start year" value="' + generalInfo.loanPaymentStartYear + '" onblur="paymentStartYearChange(this.value)"/>' + 
                                    '<p id="paymentYear_' + i + 'ErrorMsg" class="errorMsg"></p>'
            } else {
                cell1.innerHTML = '<label id="paymentYear_' + i + '" class="input-label">' + (parseInt(generalInfo.loanPaymentStartYear) + parseInt(i)) + '</label>'
            }
            var cell2 = row.insertCell(1)
            cell2.innerHTML = '<input id="yourIncome_' + i + '" placeholder="Your income" class="input-field input-income invalid" onblur="incomeChange(true, ' + i + ', this)"/>' + 
                                '<p id="yourIncome_' + i + 'ErrorMsg" class="errorMsg"></p>'
            if (isMarried) {
                var cell3 = row.insertCell(2)
                cell3.innerHTML = '<input id="spouseIncome_' + i + '" class="input-field input-income invalid" placeholder="Spouse\'s income" onblur="incomeChange(false, ' + i + ', this)"/>' +
                                    '<p id="spouseIncome_' + i + 'ErrorMsg" class="errorMsg"></p>'
            }
        }
        var rowSalaryGrowthRateRow = $el.insertRow(10)
        rowSalaryGrowthRateRow.classList.add('income-table-row')
        var cell1 = rowSalaryGrowthRateRow.insertCell(0)
        cell1.innerHTML = '<label class="input-label">Salary Growth Rate (%)</label>'
        var cell2 = rowSalaryGrowthRateRow.insertCell(1)
        cell2.innerHTML = '<input id="yourSalaryGrowth_' + i + '" class="input-field input-salary-growth" value="3.00" placeholder="Enter salary growth" onblur="salaryGrowthChange(true, this)"/>' +
                            '<p id="yourSalaryGrowth_' + i + 'ErrorMsg" class="errorMsg"></p>'
        if (isMarried) {
            var cell3 = rowSalaryGrowthRateRow.insertCell(2)
            cell3.innerHTML = '<input id="spouseSalaryGrowth_' + i + '" class="input-field input-salary-growth" value="3.00" placeholder="Enter salary growth" onblur="salaryGrowthChange(true, this)"/>' +
                                '<p id="spouseSalaryGrowth_' + i + 'ErrorMsg" class="errorMsg"></p>'
        }
    }

    generateTableHeader($incomeTableHead)
    generateTableBody($incomeTableBody)
}

function paymentStartYearChange (val) {
    if (isYear(val)) {
        var year = formatYear(val)
        incomeInfo.years[0] = year
        removeError({$el: document.getElementById('paymentYear_0'), field: 'paymentYear_0', errorMsg: ''})
        for (var i = 1; i < 10; i++) {
            incomeInfo.years[0] = year + i
            var input = document.getElementById('paymentYear_' + i)
            if (input) input.innerHTML = year + i
        }
    } else {
        addError({$el: document.getElementById('paymentYear_0'), field: 'paymentYear_0', errorMsg: 'Must be a year'})
    }
    validateForm(document.getElementById('incomeInfo'))
}

function incomeChange (bool, index, el) {
    if (isNumber(el.value)) {
        var income = formatFloat(el.value)
        if (incomeInfo.income[index] !== income) {
            if (bool) incomeInfo.income[index] = income
            else incomeInfo.spouseIncome[index] = income
            document.getElementById(el.id).value = income
            removeError({$el: document.getElementById(el.id), field: el.id, errorMsg: ''})
            for (var i = (index + 1); i < 10; i++) {
                var currentId = bool ? 'yourIncome_' + i : 'spouseIncome_' + i
                var lastId = bool ? 'yourIncome_' + (i - 1) : 'spouseIncome_' + (i - 1)
                var input = document.getElementById(currentId)
                var previousIncome = document.getElementById(lastId).value
                var nextIncome = previousIncome ? 
                    formatFloat(parseFloat(previousIncome) + parseFloat((previousIncome * (generalInfo.inflationRateAssumption / 100)))) :
                    formatFloat(parseFloat(income) + parseFloat((income * (generalInfo.inflationRateAssumption * 100))))
                if (input) input.value = nextIncome
                removeError({$el: input, field: currentId, errorMsg: ''})
            }
        }
    } else {
        addError({$el: document.getElementById(el.id), field: el.id, errorMsg: 'Must be a number'})
    }
    validateForm(document.getElementById('incomeInfo'))
}

function salaryGrowthChange (bool, el) {
    if (isPercent(el.value)) {
        var percent = formatFloat(el.value)
        document.getElementById(el.id).value = percent
        if (bool) incomeInfo.salaryGrowth = percent
        else incomeInfo.spouseSalaryGrowth = percent
        removeError({$el: document.getElementById(el.id), field: el.id, errorMsg: ''})
    } else {
        addError({$el: document.getElementById(el.id), field: el.id, errorMsg: 'Must be a percent'})
    }
}

/* --- PAGE INITIALIZATION --- */
// Click events for form elements
(function () {
    form.forEach(function(input) {
        // Assigns click events for check boxes
        if (input.$el.length > 1) {
            for (var i = 0; i < input.$el.length; i++) {
                var subInput = input.$el[i]
                subInput.addEventListener(input.eventType, input.eventListener)
            }
        // assigns click events for input fields
        } else {
            input.$el.addEventListener(input.eventType, input.eventListener)
        }
    })
})();

// Click events for page buttons
(function () {
    var buttons = ['generalInfoNextBtn', 'personalInfoNextBtn', 'personalInfoBackBtn', 'incomeInfoNextBtn', 'incomeInfoBackBtn']
    for (var i = 0; i < buttons.length; i++) {
        document.getElementById(buttons[i]).addEventListener('click', showView)
    }
    document.getElementById('addChildButton').addEventListener('click', appendChild)
})();