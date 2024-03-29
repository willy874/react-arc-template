# React Arc Template

這是一個大型的架構，可以搭配 Monorepo 更近一步做到架構分離，每一個 Domain Knowhow 的模組都可以進行解耦。

## 這架構要解決什麼問題？

一般前端大型架構在單體架構經常發生依賴循環 (Circular Dependency)，也非常難以追查，加上架構耦合問題，不容易做到模組解耦。

循環依賴現象難以發現，一般在 ESModule 不會發生明顯問題，但會隱隱潛藏在運行中，用不同形式表現出問題。

## 靈活的可拓展架構

因為每一個 Domain Knowhow 都被抽離，唯一依賴的的是極共用的模組，很容易依據需求拆裝成 Package。

## 解耦方案

### Event bus

可以進行一對多的監聽和一對多的觸發，監聽與觸發本身不互相耦合。

### Query bus

可以進行一對多的觸發，取其一獲取 Promise 回應，兩者不互相耦合，只遵循抽象介面。

### Dependency inject

每個獨立業務模組要自行建立依賴體系，大部分情況並不互相依賴，所以每個模組可以獨立開發不互相衝突。
