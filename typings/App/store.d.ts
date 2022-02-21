/**
 * vuex状态管理属性声明
 */
declare namespace dStore {
    /**
     * store/modules/map.ts
     */
    namespace map {
        /**
         * 面板属性
         */
        interface PanelOptions {
            com: string,
            box: string,
            title: string
            param: object
        }
        interface state {
            /**
             * 左半框
             */
            panels: Array<PanelOptions>,
            /**
             * 全框
             */
            fullPanels: Array<PanelOptions>,
            /**
             * 下半框
             */
            halfPanels: Array<PanelOptions>,
            /**
             * 浮动框
             */
            floatPanels: Array<PanelOptions>,
            /**
             * 激活的全框
             */
            fullP_editableTabsValue: string,
            /**
             * 激活的半框
             */
            halfP_editableTabsValue: string,
            /**
             * 激活的浮动框
             */
            floatP_editableTabsValue: string,
            /**
             * 激活的左半框
             */
            P_editableTabsValue: string
        }
    }
    namespace tagsView {
        interface state {
            visitedViews: [],
            cachedViews: []
        }
    }
}