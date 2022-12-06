<script>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import PhotoService from '@/services/demo/PhotoService';

export default {
  setup() {
    const toast = useToast();
    const uploadedFile = ref([]);
    const files = ref([]);
    const totalSize = ref(0);
    const totalSizePercent = ref(0);
    const selectFile = ref("");
    const selectFileUpload = ref("");

    const onRemoveTemplatingFile = (file, onFileRemove, index) => {
      onFileRemove(index);
      totalSize.value -= parseInt(this.formatSize(file.size));
      totalSizePercent.value = totalSize.value / 10;
    };

    const onClearTemplatingUpload = (clear) => {
      clear();
      totalSize.value = 0;
      totalSizePercent.value = 0;
    };

    const onSelectedFiles = (event) => {
      files.value = event.files;
      files.value.forEach((file) => {
        totalSize.value += parseInt(this.formatSize(file.size));
      });
    };

    const onAdvancedUpload = () => {
      toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
    };

    const uploadEvent = (callback) => {
      totalSizePercent.value = totalSize.value / 10;
      callback();
    };

    const onTemplatedUpload = () => {
      totalSize.value = 0;
      totalSizePercent.value = 0;
      toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
    };

    const onUpload = () => {
      toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
    };

    const formatSize = (bytes) => {
      if (bytes === 0) {
        return "0 B";
      }

      let k = 1000,
        dm = 3,
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const onDbClickImage = (url) => {
        selectFile.value = url;
    }
    const onDbClickImageUpload = (url) => {
        selectFileUpload.value = url;
    }

    // const beforeUpload = (event) => {
    //     console.log("dsaadsa")
    //     console.log(event)
    //     event.xhr.setRequestHeader("Accept","application/json");
    // }

    return {
      onUpload,
      onRemoveTemplatingFile,
      onClearTemplatingUpload,
      onSelectedFiles,
      onAdvancedUpload,
      uploadEvent,
      onTemplatedUpload,
      onUpload,
      formatSize,
      files,
      selectFile,
      selectFileUpload,
      uploadedFile,
      onDbClickImage,
      onDbClickImageUpload,
    //   beforeUpload,
    };
  },
};
</script>

<template>
  <div>
    <Toast />

    <FileUpload
      name="image"
      url="http://localhost:3000/api/upload_bill"
      @upload="onTemplatedUpload($event)"
      :multiple="true"
      accept="image/*"
      :maxFileSize="1000000"
      @select="onSelectedFiles"
    >
      <template
        #header="{ chooseCallback, uploadCallback, clearCallback, files }"
      >
        <div
          class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2"
        >
          <div class="flex gap-2">
            <Button
              @click="chooseCallback()"
              icon="pi pi-images"
              class="p-button-rounded"
            ></Button>
            <Button
              @click="uploadEvent(uploadCallback)"
              icon="pi pi-cloud-upload"
              class="p-button-rounded p-button-success"
              :disabled="!files || files.length === 0"
            ></Button>
            <Button
              @click="clearCallback()"
              icon="pi pi-times"
              class="p-button-rounded p-button-danger"
              :disabled="!files || files.length === 0"
            ></Button>
          </div>
          <ProgressBar
            :value="totalSizePercent"
            :showValue="false"
            :class="[
              'md:w-20rem h-1rem w-full md:ml-auto',
              { 'exceeded-progress-bar': totalSizePercent > 100 },
            ]"
            ><span class="white-space-nowrap"
              >{{ totalSize }}B / 1Mb</span
            ></ProgressBar
          >
        </div>
      </template>
      <template
        #content="{
          files,
          uploadedFiles,
          removeUploadedFileCallback,
          removeFileCallback,
        }"
      >
        <div v-if="files.length > 0">
          <h5>Pending</h5>
          <div class="flex">
            <div class="w-5" style="height: 500px; overflow: auto">
                <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="p-fileupload-file"
                v-on:dblclick="onDbClickImage(file.objectURL)"
                >
                <img
                    role="presentation"
                    class="p-fileupload-file-thumbnail"
                    :alt="file.name"
                    :src="file.objectURL"
                    :width="60"
                />
                <div class="p-fileupload-file-details">
                    <span class="font-semibold">{{ file.name }}</span>
                    <div>{{ formatSize(file.size) }}</div>
                    <Badge value="Pending" severity="warning" />
                </div>
                <div class="p-fileupload-file-actions">
                    <Button
                    icon="pi pi-times"
                    @click="
                        onRemoveTemplatingFile(file, removeFileCallback, index)
                    "
                    class="p-button-outlined p-button-danger p-button-rounded"
                    />
                </div>
                </div>
            </div>
            <Divider layout="vertical" />
            <div class="w-7 card p-4 flex justify-content-center" style="height: 500px; overflow: auto">
                <Skeleton width="100%" height="6rem" v-if="!selectFile"/>
              <Image v-else :src="selectFile" alt="Image Text" preview >
              </Image>
            </div>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Hoàn thành</h5>
          <div class="flex">
            <div class="w-5" style="height: 500px; overflow: auto">
              <div
                v-for="(file, index) of uploadedFiles"
                :key="file.name + file.type + file.size"
                class="p-fileupload-file p-ripple" v-ripple
                v-on:dblclick="onDbClickImageUpload(file.objectURL)"
              >
                <!-- <img
                  role="presentation"
                  :alt="file.name"
                  :src="file.objectURL"
                  width="60"
                  class="shadow-2"
                /> -->
                <div class="p-fileupload-file-details">
                  <span class="font-semibold">{{ file.name }}</span>
                  <div>{{ formatSize(file.size) }}</div>
                  <Badge value="Completed" class="mt-3" severity="success" />
                </div>
                <div class="p-fileupload-file-actions">
                  <Button
                    icon="pi pi-times"
                    @click="removeUploadedFileCallback(index)"
                    class="p-button-outlined p-button-danger p-button-rounded"
                  />
                </div>
              </div>
            </div>

            <Divider layout="vertical" />
            <div class="w-7 card p-4 flex justify-content-center" style="height: 500px; overflow: auto">
                <Skeleton width="100%" height="6rem" v-if="!selectFileUpload"/>
              <Image v-else :src="selectFileUpload" alt="Image Text" preview >
              </Image>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex align-items-center justify-content-center flex-column">
          <i
            class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
          />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.custom-progress-bar) {
  .p-progressbar-value {
    background-color: #f44336;
  }
}
::v-deep(.custom-galleria) {
    &.fullscreen {
        display: flex;
        flex-direction: column;

        .p-galleria-content {
            flex-grow: 1;
            justify-content: center;
        }
    }

    .p-galleria-content {
        position: relative;
    }

    .p-galleria-thumbnail-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .p-galleria-thumbnail-items-container {
        width: 100%;
    }

    .custom-galleria-footer {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, .9);
        color: #ffffff;

        > button {
            background-color: transparent;
            color: #ffffff;
            border: 0 none;
            border-radius: 0;
            margin: .2rem 0;

            &.fullscreen-button {
                margin-left: auto;
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }

    .title-container {
        > span {
            font-size: .9rem;
            padding-left: .829rem;

            &.title {
                font-weight: bold;
            }
        }
    }
}

</style>
