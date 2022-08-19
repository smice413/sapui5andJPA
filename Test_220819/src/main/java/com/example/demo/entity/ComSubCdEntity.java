package com.example.demo.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="com_sub_cd")
@SequenceGenerator(
	   name= "sub_cd_seq",
	   sequenceName="com_sub_cd_sub_cd_seq",
	   initialValue= 1, 	//시작값
	   allocationSize= 1)   //메모리를 통해 할당할 범위 사이즈
public class ComSubCdEntity {

@Id
@GeneratedValue(strategy=GenerationType.SEQUENCE, generator ="sub_cd_seq")
@Column(name = "sub_cd_seq")						private Long				 subCdSeq;
@Column(name = "sub_cd" , nullable = false)			private String 				 subCd;
@Column(name = "mast_cd", nullable = false)			private String				 mastCd;
@Column(name = "sub_cd_nm")							private String				 subCdNm;
@Column(name = "use_yn")							private Character 			 useYn;
@Column(name = "create_user_id")					private String				 createUserId;
@Column(name = "create_date")						private LocalDateTime 	     createDate;
@Column(name = "modify_user_id")					private String				 modifyUserId;
@Column(name = "modify_date")						private LocalDateTime		 modifyDate;



}
