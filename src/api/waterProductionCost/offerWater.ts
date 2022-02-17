import requets from "@/utils/request"

// 供水量分布图
  // 年度
  export function yearOfferWater(params) {
    return requets({
      url: "/gis/offerWater/year",
      method: "get",
      params
    })
  }
  // 季度
  export function quarterOfferWater(params) {
    return requets({
      url: "/gis/offerWater/quarter",
      method: "get",
      params
    })
  }// 月度
  export function monthOfferWater(params) {
    return requets({
      url: "/gis/offerWater/month",
      method: "get",
      params
    })
  }