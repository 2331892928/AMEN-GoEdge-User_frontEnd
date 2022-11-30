<template>
  <div>
    <div>
      <q-table
        :data="data"
        :columns="columns"
        title="测试"
        no-data-label="没有数据"
        no-results-label="没有筛选数据"
        loading-label="稍等哦，正在加载中"
        rows-per-page-label="每页显示数量："
        :rows-per-page-options="[10,15,20,25,50,0]"
        row-key="name"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="a" :props="props">
              {{ props.row.a }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      columns: [{
        name: 'name',
        required: true,
        label: '一字段',
        align: 'left',
        field: 'name',
        style: 'width: 100px',
        sortable: true
      }
      ],
      data: [
        {
          name: '张三',
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },
        {
          name: '李四',
          a: 6,
          b: 2,
          c: 3,
          d: 4
        },
        {
          name: '王五',
          a: 8,
          b: 9,
          c: 10,
          d: 11
        },
        {
          name: '张三',
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },
        {
          name: '张三',
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },
        {
          name: '李四',
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },
        {
          name: '王五',
          a: 1,
          b: 2,
          c: 3,
          d: 4
        }
      ]
    }
  }

}
</script>

<style scoped>

</style>
