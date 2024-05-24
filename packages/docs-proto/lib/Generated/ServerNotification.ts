/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.20.3
 * source: ServerNotification.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from 'google-protobuf'
export class ServerNotification extends pb_1.Message {
  #one_of_decls: number[][] = []
  constructor(
    data?:
      | any[]
      | {
          type?: number
          content?: Uint8Array
          timestamp?: number
        },
  ) {
    super()
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls)
    if (!Array.isArray(data) && typeof data == 'object') {
      if ('type' in data && data.type != undefined) {
        this.type = data.type
      }
      if ('content' in data && data.content != undefined) {
        this.content = data.content
      }
      if ('timestamp' in data && data.timestamp != undefined) {
        this.timestamp = data.timestamp
      }
    }
  }
  get type() {
    return pb_1.Message.getFieldWithDefault(this, 1, 0) as number
  }
  set type(value: number) {
    pb_1.Message.setField(this, 1, value)
  }
  get content() {
    return pb_1.Message.getFieldWithDefault(this, 2, new Uint8Array(0)) as Uint8Array
  }
  set content(value: Uint8Array) {
    pb_1.Message.setField(this, 2, value)
  }
  get timestamp() {
    return pb_1.Message.getFieldWithDefault(this, 3, 0) as number
  }
  set timestamp(value: number) {
    pb_1.Message.setField(this, 3, value)
  }
  static fromObject(data: { type?: number; content?: Uint8Array; timestamp?: number }): ServerNotification {
    const message = new ServerNotification({})
    if (data.type != null) {
      message.type = data.type
    }
    if (data.content != null) {
      message.content = data.content
    }
    if (data.timestamp != null) {
      message.timestamp = data.timestamp
    }
    return message
  }
  toObject() {
    const data: {
      type?: number
      content?: Uint8Array
      timestamp?: number
    } = {}
    if (this.type != null) {
      data.type = this.type
    }
    if (this.content != null) {
      data.content = this.content
    }
    if (this.timestamp != null) {
      data.timestamp = this.timestamp
    }
    return data
  }
  serialize(): Uint8Array
  serialize(w: pb_1.BinaryWriter): void
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter()
    if (this.type != 0) writer.writeInt32(1, this.type)
    if (this.content.length) writer.writeBytes(2, this.content)
    if (this.timestamp != 0) writer.writeUint64(3, this.timestamp)
    if (!w) return writer.getResultBuffer()
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ServerNotification {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes),
      message = new ServerNotification()
    while (reader.nextField()) {
      if (reader.isEndGroup()) break
      switch (reader.getFieldNumber()) {
        case 1:
          message.type = reader.readInt32()
          break
        case 2:
          message.content = reader.readBytes()
          break
        case 3:
          message.timestamp = reader.readUint64()
          break
        default:
          reader.skipField()
      }
    }
    return message
  }
  serializeBinary(): Uint8Array {
    return this.serialize()
  }
  static deserializeBinary(bytes: Uint8Array): ServerNotification {
    return ServerNotification.deserialize(bytes)
  }
}
