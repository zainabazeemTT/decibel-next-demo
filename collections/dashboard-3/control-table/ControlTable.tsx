import WaterfallChart from '@ant-design/plots/es/components/waterfall'
import { Button, Col, Row, Space, Table, CheckableTag, Tag, Text, Modal, Notification } from '@app/components'
import { CONTROL_DASHBOARD_DATA } from '@app/data'
import { IStore } from '@app/redux'
import { ColumnsType, Call } from '@app/types'
import { message, TablePaginationConfig } from 'antd'
import { PhysicalCardOrder } from '../CallDetails'
import { API } from 'libs/apis'
import { NextRouter, useRouter } from 'next/router'
import { MouseEventHandler } from 'react'
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
    const offset: number = (newPage - 1) * 6
    const limit: number = (newPage - 1) * 6 + 6
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
  function renderCallType(record: Call): JSX.Element {
    let callType: string = ''
    let color = ''

    if (record.call_type === 'voicemail') {
      callType = 'Voicemail'
      color = '#777'
    } else if (record.call_type === 'answered') {
      callType = 'Answered'
      color = '#777'
    } else if (record.call_type === 'missed') {
      callType = 'Missed'
      color = '#777'
    }

    return <span style={{ color }}>{callType}</span>
  }

  // Function to render the direction column
  function renderDirection(record: Call): JSX.Element {
    return <span>{record.direction === 'inbound' ? 'Inbound' : 'Outbound'}</span>
  }

  // Function to render the actions column
  function renderActions(record: Call): JSX.Element {
    return (
      <>
        <CheckableTag onClick={handleOnOpenModal} checked>
          Add Note
        </CheckableTag>
        <Modal title="Call" visible={isModalOpen} onCancel={handleOnCloseModal} footer={false}>
          <PhysicalCardOrder call={record} accessToken={accessToken}/>
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

  const handleArchiveCallback = async (record: Call): Promise<void> => {
    // Handle archiving/unarchiving of the call

    const updatedIsArchived = await API.CALL_REQUESTS.ARCHIVE(record.id, accessToken)
    const call = updatedIsArchived.data
    handleUpdateCall(call)
    if (call.is_archived) {
      Notification({
        message: 'Call archived!',
        type: 'success',
      });
    } else {
      Notification({
        message: 'Call unarchived!',
        type: 'success',
      });
    }
  }

  const formatDuration = (durationInMilliseconds: number): string => {
    const seconds = Math.floor(durationInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} minutes ${remainingSeconds} seconds`;
};

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
    const offset: number = (page - 1) * 6
    const limit: number = (page - 1) * 6 + 6
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

  return (
    <Row justify="center">
      <Col span={22}>
        <Table columns={columnsdata} dataSource={filteredcalls} scroll={{ x: true }} pagination={paginationConfig} />
      </Col>
    </Row>
  )
}
