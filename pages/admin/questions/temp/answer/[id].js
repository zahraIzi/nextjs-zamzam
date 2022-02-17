import React, { useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import dynamic from 'next/dynamic'

import {
  Button,
  Input,
  InputGroup,
  Stack,
  FormControl,
  FormErrorMessage,
  useToast,
  Container,
  Box,
  Center,
  Textarea,
  AspectRatio,
  Flex,
  SimpleGrid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton
} from '@chakra-ui/react'

import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'

import axios from 'axios'

import { getError } from '../../../../../utils/error'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import db from '../../../../../utils/db'
// const Player = dynamic(() => import('../../../../../components/player/Player'))
// const Audio = dynamic(() => import('../../../../../components/player/Audio'))
// const UploadFile = dynamic(() =>
//   import('../../../../../components/dropzone/UploadFile')
// )
// import 'videojs-plus/dist/plugins/unload'
import TemporaryAnswer from '../../../../../models/temporaryAnswer'
// import AdminLayout from '../../../../../components/layouts/admin'
const AdminLayout = dynamic(() =>
  import('../../../../../components/layouts/admin')
)

// const playerOptions = {}

function EditAnswerScreen({ answer }) {
  const token = Cookies.get('userToken')

  const userId = Cookies.get('userId')

  // const [player, setPlayer] = useState(null)

  const [filename, setFileName] = useState(answer.media_path)

  const [kind, setKind] = useState(answer.kind)

  const initialFocusRef = useRef()

  /* eslint-disable react-hooks/exhaustive-deps */

  // useEffect(() => {
  //   if (player) {
  //     player.unload({ loading: true })
  //   }
  // }, [player])

  // useEffect(() => {
  //   if (player && filename) {
  //     player.src(filename)
  //   }
  // }, [filename, player])

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      text: '',
      full_text: ''
    }
  })
  useEffect(() => {
    if (!userId) {
      return router.push('/login')
    }
    reset({
      text: answer.text,
      full_text: answer.full_text
    })
  }, [userId])

  const toast = useToast()

  const router = useRouter()

  // function uploadHandler(fileName) {
  //   setFileName(`/media/${fileName}`)
  //   setKind(fileName.split('.').pop())
  // }

  const onSubmit = async values => {
    try {
      const { data } = await axios.post(
        `/api/admin/answer/temporary/${answer._id}`,
        {
          text: values.text,
          full_text: values.full_text,
          media_path: filename,
          kind: kind,
          userId: answer.userId
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
      router.push('/admin/questions')
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
      return
    }
  }

  async function deleteFileHandler() {
    try {
      await axios.put(
        `/api/admin/answer/temporary/${answer._id}`,
        {
          kind: kind
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      setKind('0')
      setFileName('')
      toast({
        title: 'فایل با موفقیت حذف شد',
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
      return
    }
  }

  async function deleteHandler() {
    try {
      const { data } = await axios.delete(
        `/api/admin/answer/temporary/${answer._id}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )

      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
      router.push(`/admin/questions/temp/answers/${answer.questionId}`)
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
      return
    }
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray"
            overflow="hidden"
            bg="white"
            alignItems="center"
            justifyContent="space-between"
            m={15}
          >
            {kind === 'mp4' && (
              <Flex
                mt={5}
                boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
                borderRadius={'15px'}
                flexDir="column"
                justifyContent="center"
              >
                <AspectRatio maxW="640px" ratio={1.7}>
                  {/* <Player
                    playerOptions={playerOptions}
                    onPlayerInit={setPlayer}
                    onPlayerDispose={setPlayer}
                  /> */}
                </AspectRatio>
              </Flex>
            )}
            {kind === 'mp3' && (
              <Flex
                mt={5}
                boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
                borderRadius={'15px'}
                w="100%"
                flexDir="column"
                justifyContent="center"
              >
                {/* <Audio src={filename} /> */}
              </Flex>
            )}

            <Center>{/* <UploadFile onUpload={uploadHandler} /> */}</Center>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl isInvalid={errors.text}>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="متن کوتاه احکام"
                      id="text"
                      name="text"
                      {...register('text', {
                        required: {
                          value: true,
                          message: 'لطفا  متن کوتاه جواب را وارد نمایید!'
                        },
                        pattern: {
                          value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی  ,.]+$/,
                          message: 'لطفا متن کوتاه جواب را به فارسی وارد نمایید'
                        }
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.text && errors.text.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.full_text}>
                  <InputGroup>
                    <Textarea
                      resize={true}
                      rows={5}
                      placeholder="متن کامل جواب"
                      id="full_text"
                      name="full_text"
                      {...register('full_text', {
                        required: {
                          value: true,
                          message: 'لطفا  متن کامل جواب را وارد نمایید!'
                        }
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.full_text && errors.full_text.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>

              <SimpleGrid minChildWidth="120px" spacing="40px">
                <Box>
                  <Popover
                    initialFocusRef={initialFocusRef}
                    placement="bottom"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Button
                        borderRadius={0}
                        colorScheme="telegram"
                        variant="solid"
                        rightIcon={<CheckIcon />}
                        isFullWidth
                      >
                        تایید جواب
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      color="white"
                      bg="blue.800"
                      borderColor="blue.800"
                    >
                      <PopoverHeader pt={4} fontWeight="bold" border="0">
                        هشدار!
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />

                      <PopoverBody>
                        درصورت تایید جواب،تمام جوابهای ثبت شده حذف می شود و سوال
                        به همراه جواب در لیست احکام نمایش داده خواهد شد.
                      </PopoverBody>
                      <PopoverFooter
                        border="0"
                        d="flex"
                        justifyContent="space-between"
                        pb={4}
                      >
                        <Button type="submit" colorScheme="green">
                          تایید
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </Box>
                <Box>
                  <Button
                    borderRadius={0}
                    isLoading={isSubmitting}
                    colorScheme="red"
                    variant="solid"
                    rightIcon={<DeleteIcon />}
                    onClick={deleteFileHandler}
                    isFullWidth
                  >
                    حذف فایل
                  </Button>
                </Box>
                <Box>
                  <Button
                    borderRadius={0}
                    isLoading={isSubmitting}
                    colorScheme="red"
                    variant="solid"
                    rightIcon={<DeleteIcon />}
                    onClick={deleteHandler}
                    isFullWidth
                  >
                    حذف جواب
                  </Button>
                </Box>
              </SimpleGrid>
            </form>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}

export const getStaticPaths = async () => {
  await db.connect()

  const answers = await TemporaryAnswer.find({})
  await db.disconnect()

  // generate the paths

  const paths = answers.map(item => ({
    params: {
      id: item._id.toString()
    }
  }))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(context) {
  const { params } = context
  const { id } = params

  await db.connect()

  const answer = await TemporaryAnswer.findById(id).lean()
  await db.disconnect()
  return {
    props: {
      answer: db.convertDocToObjINAnswer(answer)
    }
  }
}

export default dynamic(() => Promise.resolve(EditAnswerScreen), { ssr: false })