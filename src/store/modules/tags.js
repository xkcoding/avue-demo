import { setStore, getStore } from "@/util/store";
import { diff } from "@/util/util";
import website from "@/config/website";
const isDashboardClosed = website.isDashboardClosed;
const dashboard = website.dashboard;
const tagObj = {
  label: "", //标题名称
  value: "", //标题的路径
  params: "", //标题的路径参数
  query: "", //标题的参数
  meta: {}, //额外参数
  group: [] //分组
};
//处理首个标签
function setFistTag(list) {
  if (list.length == 1) {
    list[0].close = false;
  } else {
    list.forEach(ele => {
      if (ele.value === dashboard.value && isDashboardClosed === false) {
        ele.close = false;
      } else {
        ele.close = true;
      }
    });
  }
}

const navs = {
  state: {
    tagList: getStore({ name: "tagList" }) || [],
    tag: getStore({ name: "tag" }) || tagObj,
    dashboard: dashboard
  },
  actions: {},
  mutations: {
    ADD_TAG: (state, action) => {
      state.tag = action;
      setStore({ name: "tag", content: state.tag, type: "session" });
      if (state.tagList.some(ele => diff(ele, action))) return;
      state.tagList.push(action);
      setFistTag(state.tagList);
      setStore({ name: "tagList", content: state.tagList, type: "session" });
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter(item => {
        return !diff(item, action);
      });
      setFistTag(state.tagList);
      setStore({ name: "tagList", content: state.tagList, type: "session" });
    },
    DEL_ALL_TAG: state => {
      state.tagList = [state.dashboard];
      setStore({ name: "tagList", content: state.tagList, type: "session" });
    },
    DEL_TAG_OTHER: state => {
      state.tagList = state.tagList.filter(item => {
        if (item.value === state.tag.value) {
          return true;
        } else if (
          !website.isDashboardClosed &&
          item.value === website.dashboard.value
        ) {
          return true;
        }
      });
      setFistTag(state.tagList);
      setStore({ name: "tagList", content: state.tagList, type: "session" });
    }
  }
};
export default navs;