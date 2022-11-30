<template>
  <div>
    <div class="text-h6" v-if="label !== undefined">{{ label }}</div>
    <div class="row" style="height:100%">
      <div class="col">
        <q-input value="" outlined label="搜索" dense @input="AsearCh" v-model="aSearCh" @focus="AsearCh"></q-input>
        <q-tab-panels animated class="shadow-2 rounded-borders" v-model="panel" style="height:500px">
          <q-tab-panel name="mails">
            <q-list separator>
              <div v-for="(val,key,i) in rows">
                <q-item clickable v-ripple active-class="bg-teal-1 text-grey-8" :active="val['active']" @click="item_click(1,val['id'])">
                  <q-item-section>
                    <q-item-label>{{ val['title'] === undefined ? '' : val['title'] }}</q-item-label>
                    <q-item-label caption lines="1" v-if="val['desc'] !== undefined">{{ val['desc'] }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <div class="q-pa-md col-2 flex justify-center" style="max-height: 10%;height:12px">
        <div class="column">
          <div class="col"><q-btn color="white" text-color="black" label=">>" @click="moved_item_click('right_all')"/></div>
          <div class="col"></div>
          <div class="col"><q-btn color="white" text-color="black" label=">" @click="moved_item_click('right')"/></div>
          <div class="col"></div>
          <div class="col"><q-btn color="white" text-color="black" label="<" @click="moved_item_click('left')"/></div>
          <div class="col"></div>
          <div class="col"><q-btn color="white" text-color="black" label="<<" @click="moved_item_click('left_all')"/></div>
          <div class="col"></div>
          <div class="col"><q-btn color="white" text-color="black" label="取消" @click="cancel()"/></div>
          <div class="col"></div>
          <div class="col"><q-btn color="white" text-color="black" label="确定" @click="preservation()"/></div>
        </div>
      </div>
      <div class="col">
        <div style="height:7%">已选择：</div>
        <q-tab-panels animated class="shadow-2 rounded-borders" v-model="panel" style="height:500px">
          <q-tab-panel name="mails">
            <div v-for="(val,key,i) in rows2">
              <q-item clickable v-ripple active-class="bg-teal-1 text-grey-8" :active="val['active']" @click="item_click(2,val['id'])">
                <q-item-section>
                  <q-item-label>{{ val['title'] }}</q-item-label>
                  <q-item-label caption lines="1">{{ val['desc'] }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>

</template>

<script>
import deepClone from '@/utils/CloneUtils'

export default {
  name: 'shuttleFrame',
  data () {
    return {
      panel: 'mails',
      rows: [],
      rawDataRows: [],
      rows2: [],
      id: -1,
      id2: -1,
      aSearCh: ''
    }
  },
  props: {
    data: Array,
    label: String
  },
  mounted () {
    this.rows = deepClone(this.data)
    const len = this.rows.length
    for (let i = 0; i < len; i++) {
      this.rows[i].active = false
      this.rows[i].id = i
    }
  },
  methods: {
    item_click (event, id) {
      if (event === 1) {
        const len = this.rows.length
        for (let i = 0; i < len; i++) {
          this.rows[i].active = this.rows[i].id === id
        }
        this.id = id
      } else {
        const len = this.rows2.length
        for (let i = 0; i < len; i++) {
          this.rows2[i].active = this.rows2[i].id === id
        }
        this.id2 = id
      }
      this.$forceUpdate()
    },
    moved_item_click (event) {
      // 先移动
      let newRows = []
      let newRow2 = []
      let len = 0
      switch (event) {
        case 'right':
          // 删除左列并增加右列
          // console.log('→')
          if (this.id === -1) break
          newRows = this.rows.filter((item) => {
            return item.id !== this.id
          })
          newRow2 = this.rows.filter((item) => {
            return item.id === this.id
          })
          this.rows2.push(newRow2[0])
          this.rows = newRows
          break
        case 'left':
          // 删除右列增加左列
          // console.log('←')
          if (this.id2 === -1) break
          newRow2 = this.rows2.filter((item) => {
            return item.id !== this.id2
          })
          // this.rows
          newRows = this.rows2.filter((item) => {
            return item.id === this.id2
          })
          this.rows.push(newRows[0])
          this.rows2 = newRow2
          break
        case 'right_all':
          // 所有左移动右
          // 先把右边的保留后再把左边的新增过去
          len = this.rows.length
          for (let i = 0; i < len; i++) {
            this.rows2.push(this.rows[i])
          }
          // this.rows2 = this.rows.map((item) => {
          //   return item
          // })
          this.rows = this.rows.filter((item) => {
            return false
          })
          break
        case 'left_all':
          // 所有右移动左
          // 先把左边的保留后再把右边的新增过去
          len = this.rows2.length
          for (let i = 0; i < len; i++) {
            this.rows.push(this.rows2[i])
          }
          // this.rows = this.rows2.map((item) => {
          //   return item
          // })
          this.rows2 = this.rows2.filter((item) => {
            return false
          })
          break
        default:
          console.log('非法')
      }
      this.id = -1
      this.id2 = -1
      // 使双方选择为假
      this.rows = this.rows.map((item) => {
        item.active = false
        return item
      })
      this.rows2 = this.rows2.map((item) => {
        item.active = false
        return item
      })
      this.$forceUpdate()
      // 返回需要的内容
      const retRows2 = this.rows2.map((item) => {
        return {
          title: item.title,
          desc: item.desc,
          value: item.value
        }
      })
      // const retRows2 = []
      // const lenV3 = this.rows2.length
      // for (let i = 0; i < lenV3; i++) {
      //   retRows2.push({
      //     title: this.rows2[i].title,
      //     desc: this.rows2[i].desc,
      //     value: this.rows2[i].value
      //   })
      // }
      // 复制源数据拱搜索使用
      this.rawDataRows = deepClone(this.rows)
      this.$emit('getMobileItems', retRows2)
    },
    cancel () {
      this.$emit('cancel')
    },
    preservation () {
      this.$emit('preservation')
    },
    AsearCh () {
      swal('暂时不能搜索', {
        icon: 'warning'
      })
      // if (this.aSearCh === '') this.rows = deepClone(this.rawDataRows)
      // this.$forceUpdate()
      // this.rows = this.rawDataRows.filter((item) => {
      //   if (item.title.toString().indexOf(this.aSearCh) === -1){
      //     return item.desc.toString().indexOf(this.aSearCh) !== -1
      //   } else {
      //     return true
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
