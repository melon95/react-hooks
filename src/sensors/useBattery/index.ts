import { useState } from "react"
import useMount from "../../lifeCycle/useMount"

interface BatteryState {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

interface BatteryManager extends Readonly<BatteryState>, EventTarget  {
  onchargingchange: (e: Event) => void
  onchargingtimechange: (e: Event) => void
  ondischargingtimechange: (e: Event) => void
  onlevelchange: (e: Event) => void
}

interface NavigatorWithPossibleBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>
}

const nav: NavigatorWithPossibleBattery = navigator

const notSupportedState = {
  isSupport: false
}

const supportedButNotFetchedState = {
  isSupport: true,
  fetched: false
}

const supportedAdnFetchedState = {
  isSupport: true,
  fetched: true
}

type useBatteryState = typeof notSupportedState | typeof supportedButNotFetchedState | typeof supportedAdnFetchedState & BatteryManager

const isBatterySupport = nav && typeof nav.getBattery === 'function'


function useBattery(): useBatteryState {
  const [batteryState, setBatteryState] = useState<useBatteryState>(supportedButNotFetchedState)

  useMount(() => {
    nav!.getBattery!().then((battery: BatteryManager) => {
      setBatteryState({
       ...supportedAdnFetchedState,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        level: battery.level,
      })
      // 监听充电状态的变更
      battery.addEventListener('chargingchange', () => {
        setBatteryState({
          ...batteryState,
          charging: battery.charging,
        })
      })
      // 监听充电时间的变更
      battery.addEventListener('chargingtimechange', () => {
        setBatteryState({
          ...batteryState,
          chargingTime: battery.chargingTime,
        })
      })
      // 监听放电时间的变更
      battery.addEventListener('dischargingtimechange', () => {
        setBatteryState({
          ...batteryState,
          dischargingTime: battery.dischargingTime,
        })
      })
      // 监听电量的变更
      battery.addEventListener('levelchange', () => {
        setBatteryState({
          ...batteryState,
          level: battery.level,
        })
      })
    })
  })

  return batteryState
}

function useBatteryMock(): useBatteryState {
  return notSupportedState
}

export default isBatterySupport ? useBattery :useBatteryMock