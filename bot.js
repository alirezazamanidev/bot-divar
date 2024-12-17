import { Builder, Browser, until, By, Key } from "selenium-webdriver";
import { lutimesSync, writeFileSync } from "fs";
(async () => {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get("https://divar.ir/s/mashhad");
    const searchInput = await driver.findElement(
      By.css("div.nav-bar__search-container input.kt-nav-text-field__input")
    );

    await searchInput.sendKeys("صابون گلنار", Key.ENTER);

    await driver.wait(
      until.elementsLocated(By.css("article.kt-post-card")),
      1000
    );

    const ads = await driver.findElements(By.css("article.kt-post-card a"));
    let links = [];
    for (const ad of ads) {
      const link = await ad.getAttribute("href");

      links.push(link);
    }

    let listData = [];
    for (const link of links) {
      await driver.get(link);
      await driver.sleep(2000);
      await driver.executeScript(`
            const titleElement = document.querySelector('h1.kt-page-title__title');
            titleElement.style.border = '2px solid red'; // اضافه کردن حاشیه قرمز
        `);

      // حذف حاشیه بعد از یک ثانیه
      await driver.executeScript(`
            const titleElement = document.querySelector('h1.kt-page-title__title');
            setTimeout(() => {
                titleElement.style.border = 'none'; // حذف حاشیه
            }, 1000); // 1000 میلی‌ثانیه = 1 ثانیه
        `);
      await driver.sleep(3000);
      const title = await driver
        .findElement(By.css("h1.kt-page-title__title"))
        .getText();

      listData.push({ title, link });
      await driver.navigate().back();
      writeFileSync("list.json", JSON.stringify(listData, null, 4));
      await driver.sleep(2000);
    }
  } catch (error) {
    console.log(error);
  }
})();
