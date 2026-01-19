<p align="center">
  <img src="https://github.com/user-attachments/assets/7fea2a8d-7d6a-4b43-9e03-fc71aad3f249" width="400" alt="Chrono"/>
</p>

> **GitHub 개발 활동으로 사이드 프로젝트의 진행 흐름을 기록하는 서비스**

# 크로노를 소개합니다!

chrono.(크로노)는 GitHub 개발 활동을 중심으로, 사이드 프로젝트의 진행 상황을 자연스럽게 기록하고 확인할 수 있도록 만든 서비스입니다. 프로젝트를 진행하다 보면 진행 상황을 따로 정리하지 못한 채 흐름이 끊기는 경우가 종종 있습니다. 문서화해 관리하려 해도 꾸준히 기록하는 일 자체가 부담으로 느껴질 때도 많습니다.

<strong>크로노는 이런 번거로움을 덜기 위해, 이미 하고 있는 개발 활동—GitHub 커밋—을 기록의 기준으로 했습니다.</strong> 추가적인 입력 없이도 커밋 기록이 쌓여 프로젝트의 흐름이 정리되고,
각 프로젝트가 어떻게 진행되고 있는지 한눈에 확인할 수 있습니다. 크로노는 따로 관리하지 않아도, 개발 과정이 자연스럽게 프로젝트 기록으로 이어지는 서비스입니다.
<br><br>

## 📌 배포

* [https://app.chrono.name](https://app.chrono.name)
* 로그인 화면에서 데모 계정으로 서비스 체험 가능
<br><br>

## 👥 팀 소개

<table align="center">
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td align="center"><b>Backend</b></td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/MA-Ha-eun">
        <img src="https://github.com/MA-Ha-eun.png" width="140"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/simuneu">
        <img src="https://github.com/simuneu.png" width="140"/>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/MA-Ha-eun"><b>마하은</b></a>
    </td>
    <td align="center">
      <a href="https://github.com/simuneu"><b>박시현</b></a>
    </td>
  </tr>
</table>
<br>

## ✨ 주요 기능

### 1. GitHub 리포지토리로 프로젝트 시작하기

GitHub 리포지토리를 선택해 프로젝트를 생성합니다. 리포지토리 정보와 커밋 데이터를 자동으로 불러와, 번거로운 설정 없이 바로 시작할 수 있습니다.

<img src="https://github.com/user-attachments/assets/99c286c7-b4d4-4b99-a2d0-dcce2637e9e4" width="700">
<br>

### 2. 프로젝트 한곳에서 관리하기

여러 개의 사이드 프로젝트를 한곳에서 관리합니다. 프로젝트별 기본 정보와 진행 상태를 정리해, 진행하는 작업을 한눈에 파악할 수 있습니다.

<img src="https://github.com/user-attachments/assets/442c0a7d-d650-485a-bd13-9a30a9bdf0b7" width="700">
<br>

### 3. 커밋 기반 프로젝트 기록과 활동 시각화

GitHub 커밋 데이터를 기준으로 최신 개발 활동을 반영합니다. 프로젝트별로 최근 14일간의 커밋 활동을 그래프로 확인할 수 있습니다.

<img src="https://github.com/user-attachments/assets/4a359c34-1aa0-4442-a964-70004e4d219e" width="700">
<br>

### 4. 대시보드로 전체 현황 확인

전체 프로젝트 상태와 최근 활동을 대시보드에서 확인할 수 있습니다. 주간 커밋 내역과 전반적인 개발 흐름을 한눈에 볼 수 있습니다.

<img src="https://github.com/user-attachments/assets/18e4a4a5-153f-4198-9fda-4faa86af823b" width="700">
<br><br>

## 🔍 세부 기능

<details>
  <summary><strong>인증 · 사용자 관리</strong></summary>

- 이메일 인증을 통한 회원가입 및 로그인
- JWT 기반 인증 (Access Token / Refresh Token 분리)
- Refresh Token은 HttpOnly Cookie 방식으로 관리
- 비밀번호 변경 / 재설정 / 회원 탈퇴 기능 제공
- 내 정보 조회 및 닉네임 수정 지원

</details>

<details>
  <summary><strong>GitHub 연동</strong></summary>

- GitHub 사용자명 유효성 검사 및 프로필 정보 조회
- 퍼블릭 레포지토리 조회 및 프로젝트 등록
- Personal Access Token(PAT) 연동을 통한 Private Repository 접근
- PAT 암호화 저장 및 연동 해제 지원

</details>

<details>
  <summary><strong>프로젝트 관리</strong></summary>

- GitHub Repository 기반 프로젝트 생성
- 프로젝트 기본 정보 관리 (제목, 설명, 기술 스택, 기간)
- 진행 중 / 완료 상태 전환
- 커밋 데이터를 기반으로 프로젝트 진행 흐름 자동 반영
- 프로젝트 비활성화(소프트 삭제) 지원

</details>

<details>
  <summary><strong>커밋 수집 · 분석</strong></summary>

- GitHub 커밋 데이터 자동 및 수동 동기화
- 프로젝트별 커밋 통계 제공
  - 전체 커밋 수
  - 최근 커밋 날짜
  - 주간 커밋 분포
- 통계 및 집계 로직을 분리된 Python 분석 서버에서 처리

</details>

<details>
  <summary><strong>대시보드</strong></summary>

- 전체 프로젝트 현황 제공
- 이번 주 / 이번 달 커밋 수 제공 및 시각화
- 최근 활동 중인 프로젝트 정보 요약

</details>

<details>
  <summary><strong>설계적 특징</strong></summary>

- REST API 기반 구조
- 인증, GitHub 연동, 분석 서버 간 역할 분리
- 소프트 삭제 전략을 통한 데이터 관리
- 서비스 확장을 고려한 독립적 구성

</details>
<br>

## ⚙️ 기술 스택

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss\&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-FF6A00?logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite\&logoColor=white)

### Backend

![Java](https://img.shields.io/badge/Java-17-007396?logo=java\&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot\&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?logo=springsecurity\&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-Hibernate-59666C?logo=hibernate\&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-EA1D2C?logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?logo=gradle\&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi\&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql\&logoColor=white)

### Infrastructure

![AWS EC2](https://img.shields.io/badge/AWS_EC2-Ubuntu-FF9900?logo=amazonaws\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker\&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-Orchestration-2496ED?logo=docker\&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?logo=nginx\&logoColor=white)
![Certbot](https://img.shields.io/badge/Certbot-SSL-003A70?logo=letsencrypt\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel\&logoColor=white)
<br><br>

## 📄 시스템 설계 & 문서

<details>
  <summary><strong>시스템 / 배포 아키텍처</strong></summary>
  <br/>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/1f650ee3-527f-47c9-836e-f90f15fc8aac" width="700"/>
  </p>
</details>

<details>
  <summary><strong>ERD</strong></summary>
  <br/>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/13ed175f-b012-4653-b1a9-1243ad4df0ed" width="700"/>
  </p>
</details>

<details>
  <summary><strong>API 문서</strong></summary>
  <br/>
  <a href="./api.md">API Documentation 바로가기</a>
</details>
<br><br>

> Version: v1.0.0