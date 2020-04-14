import KindEditor from '../components/tool/kindeditor'
const install = function (Vue) {
    if (install.installed) return
    install.installed = true
    Vue.component('kindEditor', KindEditor)
}

export default install