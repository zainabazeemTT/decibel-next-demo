import {
  Col,
  Row,
  Table,
  CheckableTag,
  Modal,
  Notification,
  Select,
  Option,
} from '@app/components'
import { IStore } from '@app/redux'
import { ColumnsType, Call } from '@app/types'
import { TablePaginationConfig } from 'antd'
import { PhysicalCardOrder } from '../CallDetails'
import { API } from 'libs/apis'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const ControlTable: React.FC = () => {
  const { user } = useSelector((state: IStore) => state)
  const accessToken = user.accessToken
  //state variables
  const rowsPerPage: number = 6
  const [filter, setFilter] = useState<string>('All')
  const [page, setPage] = useState<number>(1)
  const [calls, setCalls] = useState<Call[]>([])
  const [filteredcalls, setfilteredCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [totalcount, setTotalCount] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router: NextRouter = useRouter()

  const handleOnOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleOnCloseModal = () => {
    setIsModalOpen(false)
  }

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage)
    setLoading(true)
    const offset: number = (newPage - 1) * rowsPerPage
    const limit: number = (newPage - 1) * rowsPerPage + rowsPerPage
    fetchData(offset, limit)
  }

  // Configuration for pagination
  const paginationConfig: TablePaginationConfig = {
    total: totalcount,
    pageSize: rowsPerPage,
    defaultCurrent: 1,
    current: page,
    onChange: handlePaginationChange,
    showSizeChanger: false,
    showQuickJumper: false,
  }

  // Function to render the call type column
  function renderCallType(record: Call): string {
    let callType: string = ''

    if (record.call_type === 'voicemail') {
      callType = 'Voicemail'
    } else if (record.call_type === 'answered') {
      callType = 'Answered'
    } else if (record.call_type === 'missed') {
      callType = 'Missed'
    }

    return callType
  }

  // Function to render the direction column
  function renderDirection(record: Call): string {
    return record.direction === 'inbound' ? 'Inbound' : 'Outbound'
  }

  // Function to render the actions column
  function renderActions(record: Call): JSX.Element {
    return (
      <>
        <CheckableTag onClick={handleOnOpenModal} checked>
          Add Note
        </CheckableTag>
        <Modal title="Call" visible={isModalOpen} onCancel={handleOnCloseModal} footer={false}>
          <PhysicalCardOrder call={record} accessToken={accessToken} />
        </Modal>
      </>
    )
  }
  const handleUpdateCall = (record: Call): void => {
    setfilteredCalls((prevCalls) => {
      return prevCalls.map((call) => {
        if (call.id === record.id) {
          call.is_archived = record.is_archived
        }

        return call
      })
    })
  }
  // Options for filter select
  const options: {
    value: string
    label: string
  }[] = [
    { value: 'All', label: 'All' },
    { value: 'Archived', label: 'Archived' },
    { value: 'Unarchived', label: 'Unarchived' },
  ]

  const handleArchiveCallback = async (record: Call): Promise<void> => {
    // Handle archiving/unarchiving of the call

    const updatedIsArchived = await API.CALL_REQUESTS.ARCHIVE(record.id, accessToken)
    const call = updatedIsArchived.data
    handleUpdateCall(call)
    if (call.is_archived) {
      Notification({
        message: 'Call archived!',
        type: 'success',
      })
    } else {
      Notification({
        message: 'Call unarchived!',
        type: 'success',
      })
    }
  }

  const formatDuration = (durationInMilliseconds: number): string => {
    const seconds = Math.floor(durationInMilliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes} minutes ${remainingSeconds} seconds`
  }

  const formatDate = (Date: string): string => {
    const formattedDate = Date.slice(0, 10)
    return formattedDate
  }

  // Define the columns for the table
  const columnsdata: ColumnsType = [
    {
      dataIndex: 'call_type',
      title: 'Call Type',
      render: (_: Call, record: Call) => renderCallType(record),
    },
    {
      dataIndex: 'direction',
      title: 'Direction',
      render: (_: Call, record: Call) => renderDirection(record),
    },
    {
      dataIndex: 'duration',
      title: 'Duration',
      render: (duration: number) => formatDuration(duration),
    },
    {
      dataIndex: 'from',
      title: 'From',
    },
    {
      dataIndex: 'to',
      title: 'To',
    },
    { dataIndex: 'via', title: 'Via' },
    {
      dataIndex: 'created_at',
      title: 'Created At',
      render: (created_at: string) => formatDate(created_at),
    },
    {
      dataIndex: 'status',
      title: 'Status',
      render: (_: Call, record: Call) => (
        <>
          {record.is_archived ? (
            <CheckableTag onClick={() => handleArchiveCallback(record)} checked={true}>
              Archived
            </CheckableTag>
          ) : (
            <CheckableTag onClick={() => handleArchiveCallback(record)} checked={false}>
              Unarchived
            </CheckableTag>
          )}
        </>
      ),
    },
    {
      dataIndex: 'actions',
      title: 'Actions',
      render: (_: Call, record: Call) => renderActions(record),
    },
  ]

  useEffect(() => {
    const offset: number = (page - 1) * rowsPerPage
    const limit: number = (page - 1) * rowsPerPage + rowsPerPage
    fetchData(offset, limit)
  }, [])

  //function to fetch data based on offset and limit
  const fetchData = async (offset: number, limit: number): Promise<void> => {
    const response = await API.CALL_REQUESTS.GET(offset, limit, accessToken)
    if (response) {
      setTotalCount(response.data.totalCount)
      setCalls(response.data.nodes)
      setfilteredCalls(response.data.nodes)
    }
  }

  //filter calls based on chosen filter value
  const handleFilterChange = (selectedValue: unknown): void => {
    if (typeof selectedValue === 'string') {
      setFilter(selectedValue)
    }
    try {
      let filterCalls

      if (selectedValue === 'All') {
        filterCalls = calls
      } else {
        filterCalls = calls.filter((call) => {
          if (selectedValue === 'Archived') {
            return call.is_archived
          } else if (selectedValue === 'Unarchived') {
            return !call.is_archived
          }
          return false
        })
      }

      setfilteredCalls(filterCalls)
    } catch (error) {
      alert(`Error fetching data:${error}`)
    }
  }

  return (
    <Row justify="center">
      <Col span={22}>
        <Select value={filter} onChange={(value: unknown) => handleFilterChange(value)}>
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={22}>
        <Table columns={columnsdata} dataSource={filteredcalls} scroll={{ x: true }} pagination={paginationConfig} />
      </Col>
    </Row>
  )
}
