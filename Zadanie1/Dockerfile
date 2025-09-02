FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV SDKMAN_DIR="/root/.sdkman"
ENV PATH="${SDKMAN_DIR}/candidates/java/current/bin:${SDKMAN_DIR}/candidates/kotlin/current/bin:${SDKMAN_DIR}/candidates/gradle/current/bin:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl zip unzip ca-certificates bash git gnupg software-properties-common \
  && add-apt-repository ppa:deadsnakes/ppa -y \
  && apt-get update && apt-get install -y --no-install-recommends \
      python3.10 \
  && rm -rf /var/lib/apt/lists/*

RUN curl -s "https://get.sdkman.io" | bash \
  && bash -lc "source ${SDKMAN_DIR}/bin/sdkman-init.sh && sdk version" \
  && bash -lc "source ${SDKMAN_DIR}/bin/sdkman-init.sh && sdk install java 8.0.392-zulu && sdk default java 8.0.392-zulu" \
  && bash -lc "source ${SDKMAN_DIR}/bin/sdkman-init.sh && sdk install kotlin" \
  && bash -lc "source ${SDKMAN_DIR}/bin/sdkman-init.sh && sdk install gradle 8.7 && sdk default gradle 8.7"

WORKDIR /app
COPY build.gradle settings.gradle /app/
COPY src /app/src/

RUN bash -lc "source ${SDKMAN_DIR}/bin/sdkman-init.sh && gradle --no-daemon build"

CMD ["bash", "-lc", "\
  python3.10 --version && echo && \
  java -version && echo && \
  kotlin -version && echo && \
  gradle --version && echo && \
  source ${SDKMAN_DIR}/bin/sdkman-init.sh && gradle --no-daemon run \
"]
