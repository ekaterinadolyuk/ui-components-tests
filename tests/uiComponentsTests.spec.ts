import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com/')
  await page.locator('a[href="/interaction"]').click()
})

const openSectionHelperFunction = async (page: Page, sectionName: string) => {
  await page.locator('div[class="container playgound-body"]').getByText(sectionName).click()
}

test('Submit a form', async ({ page }) => {
  await openSectionHelperFunction(page, 'Elements')

  const textBox = page.locator('.menu-list a[href="/text-box"]')
  await textBox.scrollIntoViewIfNeeded()
  await textBox.click()

  const expectedName = 'John Doe'
  const expectedEmail = 'test@test.com'
  const expectedAddress = '123 Main St'
  const expectedPermanentAddress = '456 Optional St'

  const fullNameInput = page.getByRole('textbox', { name: "Full Name" })
  await fullNameInput.fill(expectedName)
  
  const emailInput = page.getByRole('textbox', { name: "name@example.com" })
  await emailInput.fill(expectedEmail)

  const currentAddressInput = page.getByRole('textbox', { name: "Current Address" })
  await currentAddressInput.fill(expectedAddress)

  const permanentAddressInput = page.locator('textarea#permanentAddress')
  await permanentAddressInput.fill(expectedPermanentAddress)

  const submitButton = page.getByRole('button', { name: "Submit" })
  await submitButton.click()

  const output = page.locator('#output')
  await expect(output).toBeVisible()
  await expect(output.getByText(`Name:${expectedName}`)).toBeVisible()
  await expect(output.getByText(`Email:${expectedEmail}`)).toBeVisible()
  await expect(output.getByText(`Current Address :${expectedAddress}`)).toBeVisible()
  await expect(output.getByText(`Permananet Address :${expectedPermanentAddress}`)).toBeVisible()
});

test('Radio Buttons can be checked/unchecked', async ({ page }) => {
  await openSectionHelperFunction(page, 'Elements')

  const radioButtonTab = page.locator('.menu-list #item-2 a[href="/radio-button"]')
  await radioButtonTab.scrollIntoViewIfNeeded()
  await radioButtonTab.click()

  const yesRadio = page.getByRole('radio', { name: "Yes" })
  const impressiveRadio = page.getByRole('radio', { name: "Impressive" })
  const noRadio = page.getByRole('radio', { name: "No" })

  await yesRadio.check()
  await expect(yesRadio).toBeChecked()
  await expect(impressiveRadio).not.toBeChecked()
  await expect(noRadio).not.toBeChecked()

  await impressiveRadio.check()
  await expect(yesRadio).not.toBeChecked()
  await expect(impressiveRadio).toBeChecked()
  await expect(noRadio).not.toBeChecked()
  await expect(noRadio).toHaveClass(/disabled/)

})

test('All checkboxes can be checked', async ({ page }) => {
  await openSectionHelperFunction(page, 'Elements')
  const checkboxButtonTab = page.locator('.menu-list a[href="/checkbox"]')

  await checkboxButtonTab.scrollIntoViewIfNeeded()
  await checkboxButtonTab.click()

  const allCheckBoxes = page.getByRole('checkbox')

  for(let box of await allCheckBoxes.all()) {
    await box.check({force: true})
    expect (await box.isChecked()).toBeTruthy()
  }

  const desiredOutput = [
    "home",
    "desktop",
    "documents",
    "downloads",
    "notes",
    "commands",
    "workspace",
    "office",
    "wordFile",
    "excelFile",
    "react",
    "angular",
    "veu",
    "public",
    "private",
    "classified",
    "general"
  ]

  await expect(page.locator('#result')).toContainText('You have selected :')
  for(let item of desiredOutput) {
    await expect(page.locator('#result').locator('.text-success', {hasText: item})).toBeVisible()
  }
})

test('Dropdown values can be chosen', async ({ page }) => {
  await openSectionHelperFunction(page, 'Widgets')
  const selectMenuTab = page.locator('.menu-list a[href="/select-menu"]')
  await selectMenuTab.scrollIntoViewIfNeeded()
  await selectMenuTab.click()

  const dropDownValueElement = page.locator('#selectOne')

  const values = ["Dr.", "Mr.", "Mrs.", "Ms.", "Prof.", "Other"]

  for(let item of values) {
    await dropDownValueElement.scrollIntoViewIfNeeded()
    await dropDownValueElement.click()
    const selectOneDropdownElement = page.locator('.css-1nmdiq5-menu [role="option"]', {hasText: item})
    await selectOneDropdownElement.click()
    await expect(dropDownValueElement).toContainText(item)
  }
})

test('Button tooltip contains correct value', async ({ page }) => {
  await openSectionHelperFunction(page, 'Widgets')
  const toolTipTab = page.locator('.menu-list a[href="/tool-tips"]')
  await toolTipTab.scrollIntoViewIfNeeded()
  await toolTipTab.click()

  await page.getByRole('button', {name: "Hover me to see"}).hover()
  const toolTipCard = page.locator('[role="tooltip"] .tooltip-inner')

  const tooltipText = await toolTipCard.textContent()
  expect(tooltipText).toEqual('You hovered over the Button')
})

test('Alert can be accepted', async ({ page }) => {
  await openSectionHelperFunction(page, 'Alerts, Frame & Windows')
  const alertsTab = page.locator('.menu-list a[href="/alerts"]')
  await alertsTab.scrollIntoViewIfNeeded()
  await alertsTab.click()

  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual("Do you confirm action?")
    dialog.accept()
  })

  const alertForConfirmationBox = page.locator('#confirmButton')
  await alertForConfirmationBox.click()

  const acceptedAlertResult = 'You selected Ok'
  const resultText = page.locator('#confirmResult')
  await expect(resultText).toHaveText(acceptedAlertResult)
})

test('Edit cell in web table', async ({ page }) => {
  await page.locator('div[class="container playgound-body"]').getByText('Elements').click()
  const webTableTab = page.locator('.menu-list a[href="/webtables"]')
  await webTableTab.scrollIntoViewIfNeeded()
  await webTableTab.click()

  const targetRow = page.getByRole('row', {name: "cierra@example.com"})
  await targetRow.locator('.action-buttons [title="Edit"]').click()
  await page.locator('form #salary').clear()
  await page.locator('form #salary').fill('5000')
  await page.locator('#submit').click()

  await expect(targetRow).toContainText('5000')
})

test('Pick the date in 30 days in datepicker', async ({ page }) => {
  await page.locator('div[class="container playgound-body"]').getByText('Widgets').click()
  const datePickerTab = page.locator('.menu-list a[href="/date-picker"]')
  await datePickerTab.scrollIntoViewIfNeeded()
  await datePickerTab.click()

  const dateInput = page.locator('#datePickerMonthYearInput')
  await dateInput.click()

  
  let date = new Date()
  date.setDate(date.getDate() + 31)
  
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
  
  let calendarMonthAndYear = await page.locator('.react-datepicker__current-month').textContent()
  while(calendarMonthAndYear!= expectedMonthAndYear) {
    await page.locator('.react-datepicker__navigation--next').click()
    calendarMonthAndYear = await page.locator('.react-datepicker__current-month').textContent()
  }

  const expectedDate = date.getDate().toString()
  await page.locator('.react-datepicker__day').getByText(expectedDate, {exact: true}).first().click()
  let formatter = new Intl.DateTimeFormat('En-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const dateToAssert = formatter.format(date)
  await expect(dateInput).toHaveValue(dateToAssert)

})

test('Iframe contains correct text', async ({ page }) => {
  await openSectionHelperFunction(page, 'Alerts, Frame & Windows')
  const alertsTab = page.locator('.menu-list a[href="/frames"]')
  await alertsTab.scrollIntoViewIfNeeded()
  await alertsTab.click()

  const frame = page.frameLocator('#frame1').locator('h1')
  await expect(frame).toHaveText('This is a sample page')
})

