
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
        /**
         * 获取图形的样式
        */
        interface symbol{
            /**
             * 获取点样式
             * @param size 点大小（不传默认宽度2）
             * @param color 点颜色（不传默认红色）
             * @param outSize 外边框大小（不传默认红色）
             * @param outColor 外边框颜色（不传默认宽度3）
             */
            getPointStyle(size?,color?,outSize?,outColor?)

            /**
             * 获取线样式
             * @param width 线的宽度大小（不传默认宽度3）
             * @param color 线颜色（不传默认红色）
             */
            getLineStyle(width?,color?)

            /**
             * 获取面样式
             * @param lineWidth 面的边界线宽度(默认宽度3)
             * @param lineColor 面的边界颜色(默认红色)
             * @param fillColor 面里面的颜色(默认红色透明度0.1)
             */
            getPolygonStyle(lineWidth?,lineColor?,fillColor?)

            /**
             * 获取全套的样式(点、线、面)
             * @param pointSize 点的大小
             * @param pointColor 点的颜色
             * @param lineWidth 面的边界线宽度(默认宽度3)
             * @param lineColor 面的边界颜色(默认红色)
             * @param fillColor 面里面的颜色(默认红色透明度0.1)
             */
            getAllStyle(pointSize?,pointColor?,lineWidth?,lineColor?,fillColor?)

            /**
             * 获取绘制时的样式
             * @param pointSize 点的大小
             * @param pointColor 点的颜色
             * @param lineWidth 面的边界线宽度(默认宽度3)
             * @param lineColor 面的边界颜色(默认红色)
             * @param fillColor 面里面的颜色(默认红色透明度0.1)
             * @param lineDash 线打断比例(默认打断[10,10])
             */
            getDrawStyle(pointSize?,pointColor?,lineWidth?,lineColor?,fillColor?,lineDash?)
        }
    }
    namespace utils{
        /**
         * 部分通用的功能
         * */
        interface comMethod{
            /**
             * 判断数据是否为空(空返回false,不为空返回true)
             * @param value 输入检测的参数
             * */
            valueIsNotEmpty(value)

            /**
             * 将空数据重置为-
             * @param value 输入检测的参数
             * */
            emptyValue(value)

            /**
             * 使用简单的Json方法复制对象
            * @param value 需要被复制的参数
            * */ 
            jsonCopy(value)

            /**
             * 日期处理时，月及日小于10的情况下补0
             * @param value 输入的月或者田
             * */
            dateAddZero(value)

            /**
             * 获取当前时间
             * @param timeType里面的值
             * */
            getCurrentDate(type)

            /**
             * 返回的验证
             * @param result 系统的返回
             */
            verificationResult(result)
        }
    }
    namespace tagsView {
        interface state {
            visitedViews: [],
            cachedViews: []
        }
    }
}